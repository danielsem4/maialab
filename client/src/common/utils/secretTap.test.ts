import { describe, expect, it } from "vitest";
import { registerTap } from "./secretTap";

const WINDOW = 20_000;

describe("registerTap", () => {
  it("adds a tap to an empty list", () => {
    expect(registerTap([], 100, WINDOW)).toEqual([100]);
  });

  it("keeps taps inside the window", () => {
    expect(registerTap([0, 5_000], 10_000, WINDOW)).toEqual([0, 5_000, 10_000]);
  });

  it("drops taps outside the window", () => {
    expect(registerTap([0, 15_000], 20_000, WINDOW)).toEqual([15_000, 20_000]);
  });

  it("reaches 7 taps within 20 seconds", () => {
    let taps: number[] = [];
    for (let i = 0; i < 7; i++) taps = registerTap(taps, i * 3_000, WINDOW);
    expect(taps).toHaveLength(7);
  });

  it("does not reach 7 when taps are spread past the window", () => {
    let taps: number[] = [];
    for (let i = 0; i < 7; i++) taps = registerTap(taps, i * 4_000, WINDOW);
    expect(taps).toHaveLength(5);
  });
});
