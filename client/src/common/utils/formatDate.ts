/** Formats an ISO date for display in the given locale, e.g. "Mar 2024". */
export function formatMonthYear(iso: string | null, locale: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

/** Formats an ISO date as a full date, e.g. "12 March 2024". */
export function formatFullDate(iso: string | null, locale: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
}

/** Converts an ISO timestamp to the yyyy-mm-dd value a date input expects. */
export function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

/** Converts a date input value back to an ISO string, or null when empty. */
export function fromDateInputValue(value: string): string | null {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : null;
}
