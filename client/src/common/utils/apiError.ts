import { isAxiosError } from "axios";

/** Extracts the server's `{ message }` from an API error, if there is one. */
export function getApiErrorMessage(error: unknown): string | null {
  if (isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return null;
}

/** Returns the HTTP status of an API error, or null for non-HTTP errors. */
export function getApiErrorStatus(error: unknown): number | null {
  return isAxiosError(error) ? (error.response?.status ?? null) : null;
}
