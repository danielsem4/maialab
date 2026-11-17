import { describe, expect, it } from "vitest";
import { arrangementMatches, isSentenceCorrect, isSequenceMatch, scrambleOrder } from "./hitberUtils";

describe("arrangementMatches", () => {
  const model = { roof: { x: 150, y: 110 }, body: { x: 150, y: 230 }, sun: { x: 290, y: 80 } };
  const shift = (dx: number, dy: number) => ({
    roof: { x: model.roof.x + dx, y: model.roof.y + dy },
    body: { x: model.body.x + dx, y: model.body.y + dy },
    sun: { x: model.sun.x + dx, y: model.sun.y + dy },
  });

  it("passes for an exact copy translated anywhere", () => {
    expect(arrangementMatches(model, model, 45)).toBe(true);
    expect(arrangementMatches(shift(520, 0), model, 45)).toBe(true);
    expect(arrangementMatches(shift(-300, 400), model, 45)).toBe(true);
  });

  it("passes when every piece is only slightly off", () => {
    const sloppy = shift(500, 20);
    sloppy.roof = { x: sloppy.roof.x + 20, y: sloppy.roof.y - 15 };
    expect(arrangementMatches(sloppy, model, 45)).toBe(true);
  });

  it("fails for a copy scaled 2x", () => {
    const scaled = { roof: { x: 300, y: 220 }, body: { x: 300, y: 460 }, sun: { x: 580, y: 160 } };
    expect(arrangementMatches(scaled, model, 45)).toBe(false);
  });

  it("fails when roof and body are swapped", () => {
    const swapped = { roof: model.body, body: model.roof, sun: model.sun };
    expect(arrangementMatches(swapped, model, 45)).toBe(false);
  });

  it("fails when one piece is 100px off", () => {
    const off = shift(0, 0);
    off.sun = { x: off.sun.x + 100, y: off.sun.y };
    expect(arrangementMatches(off, model, 45)).toBe(false);
  });
});

describe("isSequenceMatch", () => {
  it("requires the same items in the same order", () => {
    expect(isSequenceMatch(["a", "b", "c"], ["a", "b", "c"])).toBe(true);
    expect(isSequenceMatch(["a", "b", "c"], ["b", "a", "c"])).toBe(false);
    expect(isSequenceMatch(["a", "b"], ["a", "b", "c"])).toBe(false);
  });
});

describe("scrambleOrder", () => {
  it("is a permutation that differs from the original order", () => {
    const order = scrambleOrder(6);
    expect(order).toEqual([1, 3, 5, 0, 2, 4]);
    expect([...order].sort()).toEqual([0, 1, 2, 3, 4, 5]);
    expect(scrambleOrder(2)).toEqual([1, 0]);
  });
});

describe("isSentenceCorrect", () => {
  const words = ["the", "cat", "sees", "the", "dog"];

  it("accepts the original order, with repeated words interchangeable", () => {
    expect(isSentenceCorrect(words, [0, 1, 2, 3, 4])).toBe(true);
    expect(isSentenceCorrect(words, [3, 1, 2, 0, 4])).toBe(true);
  });

  it("rejects a wrong or incomplete order", () => {
    expect(isSentenceCorrect(words, [1, 0, 2, 3, 4])).toBe(false);
    expect(isSentenceCorrect(words, [0, 1, 2])).toBe(false);
  });
});
