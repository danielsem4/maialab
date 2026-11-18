import type { ILexicalItem } from "@/common/types/Palpa";

/** Hebrew niqqud/cantillation, Arabic harakat and Latin combining marks. */
const DIACRITICS = /[֑-ׇً-ٰٟ̀-ͯ]/g;

/** Normalizes a typed answer for comparison: no diacritics, trimmed, lower-case, single spaces. */
export function normalizeAnswer(value: string): string {
  return value.normalize("NFD").replace(DIACRITICS, "").normalize("NFC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

/** True when `input` matches one of the pipe-separated `accepted` answers ("house|home"). */
export function matchesAnswer(input: string, accepted: string): boolean {
  const answer = normalizeAnswer(input);
  if (!answer) return false;
  return accepted.split("|").some((option) => normalizeAnswer(option) === answer);
}

/** How many responses ("is a real word?") agree with the items. Missing responses count as wrong. */
export function countCorrect(items: readonly ILexicalItem[], responses: readonly boolean[]): number {
  return items.filter((item, i) => responses[i] === item.isWord).length;
}

/** Passed when at most one item was answered wrong. */
export function isLexicalPassed(items: readonly ILexicalItem[], responses: readonly boolean[]): boolean {
  return countCorrect(items, responses) >= items.length - 1;
}
