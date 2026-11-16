import { describe, expect, it } from "vitest";
import { formatFullDate, formatMonthYear, fromDateInputValue, toDateInputValue } from "./formatDate";

describe("formatMonthYear", () => {
  it("formats month and year", () => {
    expect(formatMonthYear("2024-03-15T00:00:00.000Z", "en")).toBe("Mar 2024");
  });

  it("returns an empty string for null or invalid input", () => {
    expect(formatMonthYear(null, "en")).toBe("");
    expect(formatMonthYear("not a date", "en")).toBe("");
  });
});

describe("formatFullDate", () => {
  it("formats a long date", () => {
    expect(formatFullDate("2024-03-12T00:00:00.000Z", "en")).toBe("March 12, 2024");
  });

  it("returns an empty string for null", () => {
    expect(formatFullDate(null, "en")).toBe("");
  });
});

describe("date input conversion", () => {
  it("round-trips a date", () => {
    const iso = fromDateInputValue("2025-01-31");
    expect(iso).toBe("2025-01-31T00:00:00.000Z");
    expect(toDateInputValue(iso)).toBe("2025-01-31");
  });

  it("maps empty values to null and back", () => {
    expect(fromDateInputValue("")).toBeNull();
    expect(toDateInputValue(null)).toBe("");
  });
});
