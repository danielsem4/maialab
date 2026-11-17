import { describe, expect, it } from "vitest";
import { mirrorRectX, mirrorX, shapesInside, snapToStep, totalPoints } from "./orientationUtils";

describe("shapesInside", () => {
  const rect = { x: 0, y: 0, width: 100, height: 100 };

  it("lists only the ids whose center is inside the rect", () => {
    const positions = { a: { x: 50, y: 50 }, b: { x: 150, y: 50 }, c: { x: 100, y: 100 } };
    expect(shapesInside(positions, rect)).toEqual(["a", "c"]);
  });

  it("returns an empty list when nothing is inside", () => {
    expect(shapesInside({ a: { x: -1, y: 5 } }, rect)).toEqual([]);
  });
});

describe("snapToStep", () => {
  it("rounds to the nearest step", () => {
    expect(snapToStep(3.4, 0, 10, 1)).toBe(3);
    expect(snapToStep(3.6, 0, 10, 1)).toBe(4);
  });

  it("clamps to the range", () => {
    expect(snapToStep(-4, 0, 10, 1)).toBe(0);
    expect(snapToStep(42, 0, 10, 1)).toBe(10);
  });

  it("counts steps from the minimum", () => {
    expect(snapToStep(2.2, 1, 9, 2)).toBe(3);
  });

  it("only clamps when the step is not positive", () => {
    expect(snapToStep(2.5, 0, 10, 0)).toBe(2.5);
  });
});

describe("mirrorX", () => {
  it("flips the x coordinate inside the width", () => {
    expect(mirrorX({ x: 100, y: 20 }, 1024)).toEqual({ x: 924, y: 20 });
  });
});

describe("mirrorRectX", () => {
  it("keeps the rect's size and flips its horizontal position", () => {
    expect(mirrorRectX({ x: 60, y: 30, width: 400, height: 400 }, 1024)).toEqual({ x: 564, y: 30, width: 400, height: 400 });
  });
});

describe("totalPoints", () => {
  it("sums the points of every stroke", () => {
    expect(totalPoints([[{ x: 0, y: 0 }], [{ x: 1, y: 1 }, { x: 2, y: 2 }]])).toBe(3);
  });

  it("is zero without strokes", () => {
    expect(totalPoints([])).toBe(0);
  });
});
