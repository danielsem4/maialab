import { describe, expect, it } from "vitest";
import en from "./locales/en";
import he from "./locales/he";
import ar from "./locales/ar";
import ru from "./locales/ru";

function flattenKeys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && value !== null ? flattenKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

function placeholders(obj: object, prefix = ""): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(obj).flatMap(([key, value]) =>
      typeof value === "object" && value !== null
        ? Object.entries(placeholders(value, `${prefix}${key}.`))
        : [[`${prefix}${key}`, (String(value).match(/{{\w+}}/g) ?? []).sort()]],
    ),
  );
}

describe.each([
  ["he", he],
  ["ar", ar],
  ["ru", ru],
])("%s locale", (_name, locale) => {
  it("has exactly the same keys as English", () => {
    expect(flattenKeys(locale)).toEqual(flattenKeys(en));
  });

  it("keeps the same interpolation placeholders", () => {
    expect(placeholders(locale)).toEqual(placeholders(en));
  });
});
