import type { Request, Response } from "express";
import { ApodServiceError, getApod } from "../services/nasaService.js";

const EARLIEST_APOD_DATE = "1995-06-16";

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getApodController(
  request: Request,
  response: Response,
): Promise<void> {
  const requestedDate = request.query.date;

  if (typeof requestedDate !== "undefined") {
    if (
      typeof requestedDate !== "string" ||
      !isValidDate(requestedDate) ||
      requestedDate < EARLIEST_APOD_DATE ||
      requestedDate > todayUtc()
    ) {
      response.status(400).json({
        error:
          "A data deve estar no formato YYYY-MM-DD, entre 1995-06-16 e hoje.",
      });
      return;
    }
  }

  try {
    const apod = await getApod(requestedDate);
    response.status(200).json(apod);
  } catch (error) {
    if (error instanceof ApodServiceError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    response.status(500).json({
      error: "Ocorreu um erro interno ao consultar a publicação.",
    });
  }
}
