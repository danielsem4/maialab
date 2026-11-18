import { describe, expect, it } from "vitest";
import { centeredBox, clampElement, containScale } from "./stageGeometry";

describe("clampElement", () => {
  it("enforces a minimum size", () => {
    expect(clampElement({ x: 0, y: 0, w: -5, h: 0 })).toMatchObject({ w: 20, h: 20 });
  });

  it("keeps part of the element on the slide", () => {
    expect(clampElement({ x: 5000, y: 5000, w: 100, h: 100 })).toMatchObject({ x: 1900, y: 1060 });
    expect(clampElement({ x: -5000, y: -5000, w: 100, h: 100 })).toMatchObject({ x: -80, y: -80 });
  });

  it("leaves a box that is already fine untouched", () => {
    const box = { x: 100, y: 200, w: 300, h: 150 };
    expect(clampElement(box)).toEqual(box);
  });

  it("replaces non-finite numbers", () => {
    expect(clampElement({ x: NaN, y: Infinity, w: NaN, h: 50 })).toEqual({ x: 0, y: 1060, w: 20, h: 50 });
  });
});

describe("centeredBox", () => {
  it("centres on the slide by default", () => {
    expect(centeredBox(400, 200)).toEqual({ x: 760, y: 440, w: 400, h: 200 });
  });

  it("centres on a given point", () => {
    expect(centeredBox(100, 100, { x: 500, y: 300 })).toEqual({ x: 450, y: 250, w: 100, h: 100 });
  });

  it("clamps a point far outside the slide", () => {
    expect(centeredBox(100, 100, { x: 9000, y: 300 })).toMatchObject({ x: 1900 });
  });
});

describe("containScale", () => {
  it("fits the slide into the container", () => {
    expect(containScale(960, 540, 0)).toBe(0.5);
    expect(containScale(1920, 540, 0)).toBe(0.5);
  });

  it("accounts for padding on every side", () => {
    expect(containScale(1060, 640, 50)).toBe(0.5);
  });

  it("never collapses to zero", () => {
    expect(containScale(0, 0)).toBe(0.05);
  });
});
