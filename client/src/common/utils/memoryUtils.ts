import { isInsideRect, type IPoint, type IRect } from "./geometry";

/** Where each item has been put: item id → target (spot or diary cell) id. One item per target. */
export type Placements = Record<string, string>;

/** The item currently placed on `targetId`, if any. */
export function itemAt(placements: Placements, targetId: string): string | undefined {
  return Object.keys(placements).find((id) => placements[id] === targetId);
}

/** Puts `itemId` on `targetId`; whatever was there goes back to the tray. */
export function placeItem(placements: Placements, itemId: string, targetId: string): Placements {
  const next: Placements = {};
  for (const [id, target] of Object.entries(placements)) {
    if (id !== itemId && target !== targetId) next[id] = target;
  }
  next[itemId] = targetId;
  return next;
}

/** Takes `itemId` off the board (back to the tray). */
export function removeItem(placements: Placements, itemId: string): Placements {
  const next = { ...placements };
  delete next[itemId];
  return next;
}

export interface IRecallScore {
  /** Original items put back on the same spot as at the start. */
  correct: number;
  /** New (never-seen) items wrongly placed in the room. */
  distractorsPlaced: number;
}

/** Compares a recall attempt with the original placements. Items not in `original` count as distractors. */
export function scoreRecall(original: Placements, recalled: Placements): IRecallScore {
  let correct = 0;
  let distractorsPlaced = 0;
  for (const [id, target] of Object.entries(recalled)) {
    if (!(id in original)) distractorsPlaced++;
    else if (original[id] === target) correct++;
  }
  return { correct, distractorsPlaced };
}

/** A recall passes with at least `minCorrect` items in the right place and no distractor placed. */
export function isRecallPassed(score: IRecallScore, minCorrect: number): boolean {
  return score.correct >= minCorrect && score.distractorsPlaced === 0;
}

/** Diary cells are identified as "day:slot". */
export function diaryCellId(day: string, slot: string): string {
  return `${day}:${slot}`;
}

export function parseDiaryCell(cellId: string): { day: string; slot: string } {
  const [day = "", slot = ""] = cellId.split(":");
  return { day, slot };
}

export interface IDiaryRule {
  id: string;
  /** If set, the appointment must be in this time slot. */
  slot?: string;
}

/** True when every appointment is placed, slot requirements hold, and no two share a day. */
export function checkDiary(placements: Placements, rules: IDiaryRule[]): boolean {
  const days = new Set<string>();
  for (const rule of rules) {
    const cell = placements[rule.id];
    if (!cell) return false;
    const { day, slot } = parseDiaryCell(cell);
    if (rule.slot && rule.slot !== slot) return false;
    if (days.has(day)) return false;
    days.add(day);
  }
  return true;
}

/** A place an item can be dropped on, as a rect in the drag container's pixels. */
export interface IDropTarget {
  id: string;
  rect: IRect;
}

/** The first target whose rect contains `point`, if any. */
export function spotAtPoint(point: IPoint, targets: IDropTarget[]): IDropTarget | undefined {
  return targets.find((target) => isInsideRect(point, target.rect));
}

export function rectCenter(rect: IRect): IPoint {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

export function offsetRect(rect: IRect, dx: number, dy: number): IRect {
  return { ...rect, x: rect.x + dx, y: rect.y + dy };
}

/** Flips a rect horizontally inside a container `width` wide (start side ↔ end side, for RTL). */
export function mirrorRect(rect: IRect, width: number): IRect {
  return { ...rect, x: width - rect.x - rect.width };
}

/** Inline style that places an absolutely positioned element over `rect`. */
export function rectStyle(rect: IRect): { left: number; top: number; width: number; height: number } {
  return { left: rect.x, top: rect.y, width: rect.width, height: rect.height };
}
