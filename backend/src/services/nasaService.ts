const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";
const REQUEST_TIMEOUT_MS = 10_000;

export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  media_type: "image" | "video";
  url: string;
  hdurl: string | null;
  copyright: string | null;
}

export class ApodServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "ApodServiceError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  data: Record<string, unknown>,
  field: string,
): string {
  const value = data[field];

  if (typeof value !== "string" || value.trim() === "") {
    throw new ApodServiceError(
      "A API da NASA retornou dados inválidos.",
      502,
    );
  }

  return value;
}

function httpsUrl(value: unknown, required: true): string;
function httpsUrl(value: unknown, required: false): string | null;
function httpsUrl(value: unknown, required: boolean): string | null {
  if (typeof value !== "string" || value.trim() === "") {
    if (required) {
      throw new ApodServiceError(
        "A API da NASA retornou dados inválidos.",
        502,
      );
    }

    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      throw new Error("URL não segura");
    }
    return url.toString();
  } catch {
    if (required) {
      throw new ApodServiceError(
        "A API da NASA retornou dados inválidos.",
        502,
      );
    }

    return null;
  }
}

function normalizeApod(payload: unknown): ApodResponse {
  if (!isRecord(payload)) {
    throw new ApodServiceError(
      "A API da NASA retornou dados inválidos.",
      502,
    );
  }

  const mediaType = requiredString(payload, "media_type");
  if (mediaType !== "image" && mediaType !== "video") {
    throw new ApodServiceError(
      "A API da NASA retornou um tipo de mídia não suportado.",
      502,
    );
  }

  return {
    date: requiredString(payload, "date"),
    title: requiredString(payload, "title"),
    explanation: requiredString(payload, "explanation"),
    media_type: mediaType,
    url: httpsUrl(payload.url, true),
    hdurl: httpsUrl(payload.hdurl, false),
    copyright:
      typeof payload.copyright === "string" && payload.copyright.trim() !== ""
        ? payload.copyright
        : null,
  };
}

export async function getApod(date?: string): Promise<ApodResponse> {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey?.trim()) {
    throw new ApodServiceError(
      "O serviço da NASA não está configurado no servidor.",
      503,
    );
  }

  const requestUrl = new URL(NASA_APOD_URL);
  requestUrl.searchParams.set("api_key", apiKey);
  if (date) {
    requestUrl.searchParams.set("date", date);
  }

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApodServiceError(
        "A consulta à NASA excedeu o tempo limite.",
        504,
      );
    }

    throw new ApodServiceError(
      "Não foi possível conectar à API da NASA.",
      502,
    );
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new ApodServiceError(
        "A API da NASA está temporariamente indisponível.",
        503,
      );
    }

    throw new ApodServiceError(
      "A API da NASA não conseguiu atender à consulta.",
      502,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApodServiceError(
      "A API da NASA retornou uma resposta inválida.",
      502,
    );
  }

  return normalizeApod(payload);
}
