import { describe, expect, it } from "vitest";
import { distance, isInsideRect, pointsToPath, toLocalPoint } from "./geometry";

describe("toLocalPoint", () => {
  it("returns the offset from the element's corner when unscaled", () => {
    expect(toLocalPoint(150, 80, { x: 100, y: 50, width: 400, height: 300 }, 400)).toEqual({ x: 50, y: 30 });
  });

  it("undoes a CSS scale on the element", () => {
    // A 1000px-wide element rendered at half size.
    expect(toLocalPoint(350, 150, { x: 100, y: 50, width: 500, height: 375 }, 1000)).toEqual({ x: 500, y: 200 });
  });

  it("falls back to no scaling when the layout width is unknown", () => {
    expect(toLocalPoint(20, 20, { x: 10, y: 10, width: 100, height: 100 }, 0)).toEqual({ x: 10, y: 10 });
  });
});

describe("distance", () => {
  it("measures the straight-line distance", () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe("isInsideRect", () => {
  const rect = { x: 10, y: 10, width: 20, height: 20 };

  it("includes points inside and on the edge", () => {
    expect(isInsideRect({ x: 15, y: 25 }, rect)).toBe(true);
    expect(isInsideRect({ x: 30, y: 30 }, rect)).toBe(true);
  });

  it("excludes points outside", () => {
    expect(isInsideRect({ x: 31, y: 15 }, rect)).toBe(false);
  });
});

describe("pointsToPath", () => {
  it("builds rounded SVG path data", () => {
    expect(pointsToPath([{ x: 1.2, y: 2.7 }, { x: 10, y: 20 }])).toBe("M1 3 L10 20");
  });

  it("returns an empty string for no points", () => {
    expect(pointsToPath([])).toBe("");
  });
});
