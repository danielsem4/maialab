import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relativeTime";

const NOW = new Date("2024-06-15T12:00:00.000Z");

describe("formatRelativeTime", () => {
  it("formats recent moments in seconds", () => {
    expect(formatRelativeTime("2024-06-15T11:59:30.000Z", "en", NOW)).toBe("30 seconds ago");
    expect(formatRelativeTime("2024-06-15T12:00:00.000Z", "en", NOW)).toBe("now");
  });

  it("picks the largest fitting unit", () => {
    expect(formatRelativeTime("2024-06-15T11:55:00.000Z", "en", NOW)).toBe("5 minutes ago");
    expect(formatRelativeTime("2024-06-15T09:00:00.000Z", "en", NOW)).toBe("3 hours ago");
    expect(formatRelativeTime("2024-06-14T12:00:00.000Z", "en", NOW)).toBe("yesterday");
    expect(formatRelativeTime("2024-06-01T12:00:00.000Z", "en", NOW)).toBe("2 weeks ago");
    expect(formatRelativeTime("2023-06-15T12:00:00.000Z", "en", NOW)).toBe("last year");
  });

  it("handles future dates", () => {
    expect(formatRelativeTime("2024-06-15T14:00:00.000Z", "en", NOW)).toBe("in 2 hours");
  });

  it("uses the given locale", () => {
    expect(formatRelativeTime("2024-06-15T11:55:00.000Z", "he", NOW)).toBe(
      new Intl.RelativeTimeFormat("he", { numeric: "auto" }).format(-5, "minute"),
    );
  });

  it("returns an empty string for invalid input", () => {
    expect(formatRelativeTime("nope", "en", NOW)).toBe("");
  });
});
