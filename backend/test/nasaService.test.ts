import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  ApodServiceError,
  getApod,
} from "../src/services/nasaService.js";

const originalFetch = globalThis.fetch;
const originalApiKey = process.env.NASA_API_KEY;

beforeEach(() => {
  process.env.NASA_API_KEY = "test-api-key";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalApiKey === undefined) {
    delete process.env.NASA_API_KEY;
  } else {
    process.env.NASA_API_KEY = originalApiKey;
  }
});

function nasaResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

test("normaliza os campos opcionais ausentes como null", async () => {
  globalThis.fetch = async () =>
    nasaResponse({
      date: "2025-01-02",
      title: "Publicação de teste",
      explanation: "Descrição de teste.",
      media_type: "image",
      url: "https://images.example.test/apod.jpg",
    });

  const apod = await getApod("2025-01-02");

  assert.equal(apod.hdurl, null);
  assert.equal(apod.copyright, null);
});

test("rejeita uma resposta sem os campos APOD obrigatórios", async () => {
  globalThis.fetch = async () =>
    nasaResponse({
      date: "2025-01-02",
      title: "Publicação incompleta",
      media_type: "image",
      url: "https://images.example.test/apod.jpg",
    });

  await assert.rejects(
    getApod("2025-01-02"),
    (error: unknown) =>
      error instanceof ApodServiceError && error.statusCode === 502,
  );
});

test("rejeita respostas com tipo de mídia não suportado", async () => {
  globalThis.fetch = async () =>
    nasaResponse({
      date: "2025-01-02",
      title: "Tipo desconhecido",
      explanation: "Descrição de teste.",
      media_type: "audio",
      url: "https://media.example.test/apod",
    });

  await assert.rejects(
    getApod("2025-01-02"),
    (error: unknown) =>
      error instanceof ApodServiceError && error.statusCode === 502,
  );
});
