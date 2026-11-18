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

test("normaliza o formato atual, usando a imagem e a descrição da NASA", async () => {
  let requestUrl: URL | undefined;
  globalThis.fetch = async (input) => {
    requestUrl = new URL(input instanceof Request ? input.url : input.toString());
    return nasaResponse({
      date: "2026-11-18",
      title: "Uma erupção solar",
      permalink: "https://science.nasa.gov/image-article/apod/",
      media_type: "image",
      explanation:
        "<strong>Explanation:</strong> Uma <a href=\"https://example.test\">imagem</a>, do Sol &amp; da sua atmosfera.",
      url: "https://science.nasa.gov/image-article/apod/",
      hdurl: "https://assets.science.nasa.gov/apod.jpg",
      copyright: "<a href=\"https://example.test\">Crédito NASA</a>",
    });
  };

  const apod = await getApod("2026-11-18");

  assert.equal(requestUrl?.pathname, "/wp-json/wp/v2/apod-basic/261118");
  assert.equal(requestUrl?.searchParams.get("date"), null);
  assert.equal(requestUrl?.searchParams.get("api_key"), "test-api-key");
  assert.equal(apod.url, "https://assets.science.nasa.gov/apod.jpg");
  assert.equal(
    apod.explanation,
    "Uma imagem, do Sol & da sua atmosfera.",
  );
  assert.equal(apod.copyright, "Crédito NASA");
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

test("rejeita uma lista vazia da nova API", async () => {
  globalThis.fetch = async () => nasaResponse([]);

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
