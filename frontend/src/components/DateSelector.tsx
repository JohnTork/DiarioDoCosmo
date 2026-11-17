import { useEffect, useState } from "react";
import { APOD_EARLIEST_DATE, getTodayDate } from "../types/Apod";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

interface DateParts {
  day: number;
  month: number;
  year: number;
}

function parseDate(date: string): DateParts {
  const [year, month, day] = date.split("-").map(Number);
  return { day, month, year };
}

function formatDate({ day, month, year }: DateParts): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getAllowedMonths(year: number, today: DateParts): number[] {
  const firstMonth = year === 1995 ? 6 : 1;
  const lastMonth = year === today.year ? today.month : 12;

  return Array.from(
    { length: lastMonth - firstMonth + 1 },
    (_, index) => firstMonth + index,
  );
}

function getAllowedDays(
  year: number,
  month: number,
  today: DateParts,
): number[] {
  const firstDay = year === 1995 && month === 6 ? 16 : 1;
  const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lastDay =
    year === today.year && month === today.month
      ? today.day
      : lastDayOfMonth;

  return Array.from(
    { length: lastDay - firstDay + 1 },
    (_, index) => firstDay + index,
  );
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = parseDate(getTodayDate());
  const [dateParts, setDateParts] = useState(() => parseDate(selectedDate));
  const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: "UTC",
  });
  const allowedMonths = getAllowedMonths(dateParts.year, today);
  const allowedDays = getAllowedDays(dateParts.year, dateParts.month, today);
  const allowedYears = Array.from(
    { length: today.year - Number(APOD_EARLIEST_DATE.slice(0, 4)) + 1 },
    (_, index) => today.year - index,
  );

  useEffect(() => {
    setDateParts(parseDate(selectedDate));
  }, [selectedDate]);

  function commitDate(nextParts: DateParts) {
    setDateParts(nextParts);
    onDateChange(formatDate(nextParts));
  }

  function handleYearChange(year: number) {
    const months = getAllowedMonths(year, today);
    const month = clamp(dateParts.month, months[0], months[months.length - 1]);
    const days = getAllowedDays(year, month, today);
    const day = clamp(dateParts.day, days[0], days[days.length - 1]);

    commitDate({ day, month, year });
  }

  function handleMonthChange(month: number) {
    const days = getAllowedDays(dateParts.year, month, today);
    const day = clamp(dateParts.day, days[0], days[days.length - 1]);

    commitDate({ day, month, year: dateParts.year });
  }

  return (
    <fieldset className="date-selector" aria-describedby="date-hint">
      <legend>Escolha uma data</legend>
      <div className="date-fields">
        <div className="date-field">
          <label htmlFor="apod-day">Dia</label>
          <select
            id="apod-day"
            value={dateParts.day}
            onChange={(event) =>
              commitDate({ ...dateParts, day: Number(event.currentTarget.value) })
            }
          >
            {allowedDays.map((day) => (
              <option key={day} value={day}>
                {String(day).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div className="date-field">
          <label htmlFor="apod-month">Mês</label>
          <select
            id="apod-month"
            value={dateParts.month}
            onChange={(event) =>
              handleMonthChange(Number(event.currentTarget.value))
            }
          >
            {allowedMonths.map((month) => (
              <option key={month} value={month}>
                {monthFormatter.format(new Date(Date.UTC(dateParts.year, month - 1, 1)))}
              </option>
            ))}
          </select>
        </div>

        <div className="date-field">
          <label htmlFor="apod-year">Ano</label>
          <select
            id="apod-year"
            value={dateParts.year}
            onChange={(event) =>
              handleYearChange(Number(event.currentTarget.value))
            }
          >
            {allowedYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <span className="date-hint" id="date-hint">
        Publicações desde 16 de junho de 1995.
      </span>
    </fieldset>
  );
}

export default DateSelector;
