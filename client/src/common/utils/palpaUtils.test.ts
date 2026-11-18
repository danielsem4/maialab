import { describe, expect, it } from "vitest";
import type { ILexicalItem } from "@/common/types/Palpa";
import { countCorrect, isLexicalPassed, matchesAnswer, normalizeAnswer } from "./palpaUtils";

describe("normalizeAnswer", () => {
  it("trims, lower-cases and collapses spaces", () => {
    expect(normalizeAnswer("  Big   House ")).toBe("big house");
  });

  it("strips Hebrew niqqud and Arabic harakat", () => {
    expect(normalizeAnswer("בַּיִת")).toBe("בית");
    expect(normalizeAnswer("بَيْت")).toBe("بيت");
  });

  it("lower-cases Cyrillic", () => {
    expect(normalizeAnswer("ДОМ")).toBe("дом");
  });
});

describe("matchesAnswer", () => {
  it("accepts any of the pipe-separated answers", () => {
    expect(matchesAnswer("Home", "house|home")).toBe(true);
    expect(matchesAnswer(" house ", "house|home")).toBe(true);
  });

  it("rejects other words and empty input", () => {
    expect(matchesAnswer("hous", "house|home")).toBe(false);
    expect(matchesAnswer("", "house|home")).toBe(false);
    expect(matchesAnswer("  ", "house||home")).toBe(false);
  });

  it("ignores niqqud on either side", () => {
    expect(matchesAnswer("בית", "בַּיִת")).toBe(true);
  });
});

const ITEMS: ILexicalItem[] = [
  { id: "a", textKey: "a", isWord: true },
  { id: "b", textKey: "b", isWord: false },
  { id: "c", textKey: "c", isWord: true },
  { id: "d", textKey: "d", isWord: false },
];

describe("countCorrect", () => {
  it("counts responses that agree with each item", () => {
    expect(countCorrect(ITEMS, [true, false, true, false])).toBe(4);
    expect(countCorrect(ITEMS, [false, true, false, true])).toBe(0);
  });

  it("treats missing responses as wrong", () => {
    expect(countCorrect(ITEMS, [true, false])).toBe(2);
  });
});

describe("isLexicalPassed", () => {
  it("passes with at most one mistake", () => {
    expect(isLexicalPassed(ITEMS, [true, false, true, false])).toBe(true);
    expect(isLexicalPassed(ITEMS, [true, true, true, false])).toBe(true);
  });

  it("fails with two or more mistakes", () => {
    expect(isLexicalPassed(ITEMS, [false, true, true, false])).toBe(false);
  });
});
