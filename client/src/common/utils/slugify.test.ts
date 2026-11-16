import { describe, expect, it } from "vitest";
import { SLUG_PATTERN, slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Deep Learning for MRI")).toBe("deep-learning-for-mri");
  });

  it("strips accents and punctuation", () => {
    expect(slugify("  Café: résumé!  ")).toBe("cafe-resume");
  });

  it("keeps Hebrew letters", () => {
    expect(slugify("מחקר חדש")).toBe("מחקר-חדש");
  });

  it("returns an empty string when nothing is left", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("limits the length to 80 characters", () => {
    expect(slugify("a".repeat(100))).toHaveLength(80);
  });

  it("produces slugs that match the slug pattern", () => {
    expect(SLUG_PATTERN.test(slugify("Hello World 2026"))).toBe(true);
    expect(SLUG_PATTERN.test("Bad Slug")).toBe(false);
  });
});
