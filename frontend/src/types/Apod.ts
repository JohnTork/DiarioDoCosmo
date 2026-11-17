export interface Apod {
  date: string;
  title: string;
  explanation: string;
  media_type: "image" | "video";
  url: string;
  hdurl: string | null;
  copyright: string | null;
}

export const APOD_EARLIEST_DATE = "1995-06-16";

export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
