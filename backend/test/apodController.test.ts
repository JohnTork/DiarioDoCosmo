import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import app from "../src/app.js";

async function withServer(
  callback: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Não foi possível iniciar o servidor de teste.");
  }

  try {
    await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

test("rejeita datas fora do formato ou do intervalo APOD", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    if (url.hostname === "api.nasa.gov") {
      throw new Error("A API externa não deveria ser chamada.");
    }

    return originalFetch(input, init);
  };

  try {
    await withServer(async (baseUrl) => {
      const currentDateParts = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "America/New_York",
        year: "numeric",
      }).formatToParts(new Date());
      const year = currentDateParts.find((part) => part.type === "year")?.value;
      const month = currentDateParts.find((part) => part.type === "month")?.value;
      const day = currentDateParts.find((part) => part.type === "day")?.value;
      assert.ok(year && month && day);

      const tomorrowDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
      tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
      const tomorrow = tomorrowDate.toISOString().slice(0, 10);
      const invalidDates = ["not-a-date", "1995-06-15", "2026-02-30", tomorrow];

      for (const date of invalidDates) {
        const response = await fetch(
          `${baseUrl}/api/apod?date=${encodeURIComponent(date)}`,
        );
        assert.equal(response.status, 400, `data rejeitada: ${date}`);
      }
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("aceita a data inicial disponível na NASA", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.NASA_API_KEY;
  process.env.NASA_API_KEY = "test-api-key";
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    if (url.hostname === "api.nasa.gov") {
      assert.equal(url.searchParams.get("date"), "1995-06-16");
      return new Response(
        JSON.stringify({
          date: "1995-06-16",
          title: "Publicação de teste",
          explanation: "Descrição de teste.",
          media_type: "image",
          url: "https://images.example.test/apod.jpg",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }

    return originalFetch(input, init);
  };

  try {
    await withServer(async (baseUrl) => {
      const response = await fetch(
        `${baseUrl}/api/apod?date=1995-06-16`,
      );
      assert.equal(response.status, 200);
      const apod: unknown = await response.json();
      assert.equal(
        typeof apod === "object" && apod !== null && "date" in apod
          ? apod.date
          : null,
        "1995-06-16",
      );
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) {
      delete process.env.NASA_API_KEY;
    } else {
      process.env.NASA_API_KEY = originalApiKey;
    }
  }
});
