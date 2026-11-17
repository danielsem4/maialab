import { distance, type IPoint } from "./geometry";

function centroid(points: IPoint[]): IPoint {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * True when the arrangement of `positions` matches `model` up to translation: both point sets are
 * shifted so their centroids coincide, then every piece must lie within `tolerance` px of its
 * model-relative position. Scale, rotation and swapped pieces all fail.
 */
export function arrangementMatches<K extends string>(
  positions: Record<K, IPoint>,
  model: Record<K, IPoint>,
  tolerance: number,
): boolean {
  const ids = Object.keys(model) as K[];
  if (ids.length === 0) return true;
  const actualCenter = centroid(ids.map((id) => positions[id]));
  const modelCenter = centroid(ids.map((id) => model[id]));
  return ids.every((id) => {
    const actual = { x: positions[id].x - actualCenter.x, y: positions[id].y - actualCenter.y };
    const expected = { x: model[id].x - modelCenter.x, y: model[id].y - modelCenter.y };
    return distance(actual, expected) <= tolerance;
  });
}

/** True when both sequences have the same length and the same items in the same order. */
export function isSequenceMatch<T>(expected: readonly T[], actual: readonly T[]): boolean {
  return expected.length === actual.length && expected.every((item, i) => item === actual[i]);
}

/**
 * A fixed, never-identity display order for `length` items (odd indices first, then even ones),
 * so a shuffled word list is stable across renders and testable.
 */
export function scrambleOrder(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  return [...indices.filter((i) => i % 2 === 1), ...indices.filter((i) => i % 2 === 0)];
}

/** True when the words picked (by index) read as the original sentence — repeated words are interchangeable. */
export function isSentenceCorrect(words: readonly string[], picked: readonly number[]): boolean {
  return isSequenceMatch(words, picked.map((i) => words[i]));
}
