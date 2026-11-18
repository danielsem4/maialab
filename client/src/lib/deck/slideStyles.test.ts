import { describe, expect, it } from "vitest";
import { elementBoxStyle, slideSurfaceStyle, themeVars } from "./slideStyles";

const theme = { colors: { background: "#fff", accent: "#2563eb" }, fontHeading: "Rubik", fontBody: "Inter" };

describe("themeVars", () => {
  it("exposes colours and fonts as CSS variables", () => {
    expect(themeVars(theme)).toEqual({
      "--deck-background": "#fff",
      "--deck-accent": "#2563eb",
      "--deck-font-heading": "Rubik",
      "--deck-font-body": "Inter",
    });
  });

  it("skips colour names that are not safe identifiers", () => {
    expect(themeVars({ ...theme, colors: { "bad name;": "#000", ok_1: "#111" } })).toEqual({
      "--deck-ok_1": "#111",
      "--deck-font-heading": "Rubik",
      "--deck-font-body": "Inter",
    });
  });
});

describe("slideSurfaceStyle", () => {
  it("uses the slide's own background when set, else the theme's", () => {
    expect(slideSurfaceStyle(theme, "#123456")).toMatchObject({ width: 1920, height: 1080, background: "#123456" });
    expect(slideSurfaceStyle(theme)).toMatchObject({ background: "var(--deck-background)", "--deck-accent": "#2563eb" });
  });
});

describe("elementBoxStyle", () => {
  it("positions and rotates an element in slide space", () => {
    expect(elementBoxStyle({ x: 10, y: 20, w: 300, h: 150, rotation: 45 })).toEqual({
      position: "absolute",
      left: 10,
      top: 20,
      width: 300,
      height: 150,
      transform: "rotate(45deg)",
    });
  });

  it("omits the transform when there is no rotation", () => {
    expect(elementBoxStyle({ x: 0, y: 0, w: 1, h: 1, rotation: 0 }).transform).toBeUndefined();
  });
});
