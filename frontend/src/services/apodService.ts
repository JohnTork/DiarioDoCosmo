import type { Apod } from "../types/Apod";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value
  );
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isApod(value: unknown): value is Apod {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isIsoDate(value.date) &&
    typeof value.title === "string" &&
    typeof value.explanation === "string" &&
    (value.media_type === "image" || value.media_type === "video") &&
    isHttpsUrl(value.url) &&
    (value.hdurl === null || isHttpsUrl(value.hdurl)) &&
    (value.copyright === null || typeof value.copyright === "string")
  );
}

function errorMessageForStatus(status: number): string {
  if (status === 400) {
    return "A data selecionada é inválida. Escolha uma data entre 16/06/1995 e hoje.";
  }

  if (status === 503) {
    return "O serviço da NASA está temporariamente indisponível. Tente novamente em instantes.";
  }

  if (status === 504) {
    return "A consulta demorou mais que o esperado. Tente novamente.";
  }

  return "Não foi possível carregar a publicação. Tente novamente.";
}

export async function fetchApod(
  date: string,
  signal: AbortSignal,
): Promise<Apod> {
  const query = new URLSearchParams({ date });
  let response: Response;

  try {
    response = await fetch(`/api/apod?${query}`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (signal.aborted) {
      throw error;
    }

    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }

  if (!response.ok) {
    throw new Error(errorMessageForStatus(response.status));
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("O servidor retornou uma resposta inválida.");
  }

  if (!isApod(payload)) {
    throw new Error("Os dados recebidos não puderam ser exibidos.");
  }

  return payload;
}
