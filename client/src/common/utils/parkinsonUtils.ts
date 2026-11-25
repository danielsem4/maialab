import type { IMedication } from "@/common/types/Parkinson";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Medications whose name contains the search text, ignoring case; all of them for an empty search. */
export function filterMedications(medications: IMedication[], query: string): IMedication[] {
  const needle = query.trim().toLowerCase();
  return needle ? medications.filter((medication) => medication.name.toLowerCase().includes(needle)) : medications;
}

/** The local date as a `<input type="date">` value, e.g. "2026-08-13". */
export function toDateInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The local time as a `<input type="time">` value, e.g. "09:07". */
export function toTimeInput(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Combines date and time input values into a local Date; null when either is missing or invalid. */
export function fromDateTimeInputs(date: string, time: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const result = new Date(`${date}T${time}:00`);
  return Number.isNaN(result.getTime()) ? null : result;
}

export function isFuture(date: Date, now: Date): boolean {
  return date.getTime() > now.getTime();
}

/** Day-first date and 24-hour time, as the app shows a dose: "13/08/2026" and "09:07". */
export function formatDoseTime(date: Date): { date: string; time: string } {
  return { date: `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`, time: toTimeInput(date) };
}
