import { APOD_EARLIEST_DATE, getTodayDate } from "../types/Apod";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = getTodayDate();

  function handleDateChange(value: string) {
    if (value >= APOD_EARLIEST_DATE && value <= today) {
      onDateChange(value);
    }
  }

  return (
    <div className="date-selector">
      <label htmlFor="apod-date">Escolha uma data</label>
      <input
        id="apod-date"
        name="date"
        type="date"
        min={APOD_EARLIEST_DATE}
        max={today}
        value={selectedDate}
        onChange={(event) => handleDateChange(event.currentTarget.value)}
      />
      <span className="date-hint">Publicações desde 16 de junho de 1995</span>
    </div>
  );
}

export default DateSelector;
