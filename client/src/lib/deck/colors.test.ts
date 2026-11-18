import { describe, expect, it } from "vitest";
import { resolveColor, themeColorVar } from "./colors";

const theme = { colors: { accent: "#2563eb", odd: "rebeccapurple" }, fontHeading: "Inter", fontBody: "Inter" };

describe("themeColorVar", () => {
  it("references a theme colour", () => {
    expect(themeColorVar("accent")).toBe("var(--deck-accent)");
  });
});

describe("resolveColor", () => {
  it("passes hex colours through, expanding the short form", () => {
    expect(resolveColor("#AABBCC", theme)).toBe("#aabbcc");
    expect(resolveColor("#abc", theme)).toBe("#aabbcc");
  });

  it("looks theme references up", () => {
    expect(resolveColor("var(--deck-accent)", theme)).toBe("#2563eb");
  });

  it("falls back to black for anything a colour input cannot show", () => {
    expect(resolveColor("transparent", theme)).toBe("#000000");
    expect(resolveColor("var(--deck-missing)", theme)).toBe("#000000");
    expect(resolveColor("var(--deck-odd)", theme)).toBe("#000000");
    expect(resolveColor(undefined, theme)).toBe("#000000");
  });
});
