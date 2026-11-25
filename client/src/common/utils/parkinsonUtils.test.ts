import { describe, expect, it } from "vitest";
import type { IMedication } from "@/common/types/Parkinson";
import { filterMedications, formatDoseTime, fromDateTimeInputs, isFuture, toDateInput, toTimeInput } from "./parkinsonUtils";

const MEDICATIONS: IMedication[] = [
  { id: "stalevo", name: "STALEVO 100/25/200 MG TAB" },
  { id: "azilect", name: "AZILECT 1 MG TAB" },
];

describe("filterMedications", () => {
  it("returns everything for an empty or blank search", () => {
    expect(filterMedications(MEDICATIONS, "")).toEqual(MEDICATIONS);
    expect(filterMedications(MEDICATIONS, "   ")).toEqual(MEDICATIONS);
  });

  it("matches part of the name, ignoring case and outer spaces", () => {
    expect(filterMedications(MEDICATIONS, " azi ").map((m) => m.id)).toEqual(["azilect"]);
    expect(filterMedications(MEDICATIONS, "mg tab").map((m) => m.id)).toEqual(["stalevo", "azilect"]);
  });

  it("returns nothing when no name matches", () => {
    expect(filterMedications(MEDICATIONS, "aspirin")).toEqual([]);
  });
});

describe("date and time input values", () => {
  const date = new Date(2026, 7, 3, 9, 7);

  it("formats local date and time with leading zeros", () => {
    expect(toDateInput(date)).toBe("2026-08-03");
    expect(toTimeInput(date)).toBe("09:07");
  });

  it("round-trips through fromDateTimeInputs", () => {
    expect(fromDateTimeInputs(toDateInput(date), toTimeInput(date))).toEqual(date);
  });

  it("is null for missing or malformed values", () => {
    expect(fromDateTimeInputs("", "09:07")).toBeNull();
    expect(fromDateTimeInputs("2026-08-03", "")).toBeNull();
    expect(fromDateTimeInputs("03/08/2026", "09:07")).toBeNull();
    expect(fromDateTimeInputs("2026-13-45", "09:07")).toBeNull();
  });
});

describe("isFuture", () => {
  const now = new Date(2026, 7, 3, 9, 7);

  it("is true only after now", () => {
    expect(isFuture(new Date(2026, 7, 3, 9, 8), now)).toBe(true);
    expect(isFuture(now, now)).toBe(false);
    expect(isFuture(new Date(2026, 7, 2, 23, 0), now)).toBe(false);
  });
});

describe("formatDoseTime", () => {
  it("gives a day-first date and a 24-hour time", () => {
    expect(formatDoseTime(new Date(2026, 7, 13, 9, 7))).toEqual({ date: "13/08/2026", time: "09:07" });
    expect(formatDoseTime(new Date(2026, 0, 5, 21, 30))).toEqual({ date: "05/01/2026", time: "21:30" });
  });
});
