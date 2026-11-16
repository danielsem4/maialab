import { describe, expect, it } from "vitest";
import { getInitials } from "./getInitials";

describe("getInitials", () => {
  it("uses the first and last word", () => {
    expect(getInitials("Ada King Lovelace")).toBe("AL");
  });

  it("handles a single word", () => {
    expect(getInitials("plato")).toBe("P");
  });

  it("ignores extra whitespace", () => {
    expect(getInitials("  Grace   Hopper ")).toBe("GH");
  });

  it("returns an empty string for an empty name", () => {
    expect(getInitials("   ")).toBe("");
  });

  it("keeps non-Latin letters", () => {
    expect(getInitials("דנה כהן")).toBe("דכ");
  });
});
