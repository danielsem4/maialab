import { useState, type ChangeEvent } from "react";
import { fromDateTimeInputs, isFuture, toDateInput, toTimeInput } from "@/common/utils/parkinsonUtils";

/** The date and time fields of a dose: saves only a valid moment that is not in the future. */
export function useDoseTimeForm(initial: Date, onSave: (time: Date) => void) {
  const [date, setDate] = useState(toDateInput(initial));
  const [time, setTime] = useState(toTimeInput(initial));
  const [invalid, setInvalid] = useState(false);

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    setDate(event.target.value);
    setInvalid(false);
  }

  function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    setTime(event.target.value);
    setInvalid(false);
  }

  function handleSave() {
    const result = fromDateTimeInputs(date, time);
    if (!result || isFuture(result, new Date())) setInvalid(true);
    else onSave(result);
  }

  return { date, time, invalid, maxDate: toDateInput(new Date()), handleDateChange, handleTimeChange, handleSave };
}
