import { describe, expect, it } from "vitest";
import {
  checkDiary,
  diaryCellId,
  isRecallPassed,
  itemAt,
  parseDiaryCell,
  placeItem,
  removeItem,
  mirrorRect,
  offsetRect,
  rectCenter,
  rectStyle,
  scoreRecall,
  spotAtPoint,
} from "./memoryUtils";

describe("placeItem / itemAt / removeItem", () => {
  it("places an item and finds it by target", () => {
    const p = placeItem({}, "keys", "sofa");
    expect(p).toEqual({ keys: "sofa" });
    expect(itemAt(p, "sofa")).toBe("keys");
    expect(itemAt(p, "table")).toBeUndefined();
  });

  it("moves an item that is already placed", () => {
    expect(placeItem({ keys: "sofa" }, "keys", "table")).toEqual({ keys: "table" });
  });

  it("sends the previous occupant back to the tray", () => {
    expect(placeItem({ keys: "sofa", phone: "table" }, "phone", "sofa")).toEqual({ phone: "sofa" });
  });

  it("removes an item without mutating the input", () => {
    const p = { keys: "sofa", phone: "table" };
    expect(removeItem(p, "keys")).toEqual({ phone: "table" });
    expect(p).toEqual({ keys: "sofa", phone: "table" });
  });
});

describe("scoreRecall / isRecallPassed", () => {
  const original = { keys: "sofa", phone: "table", glasses: "shelf", wallet: "drawer" };

  it("counts correct items and placed distractors", () => {
    const score = scoreRecall(original, { keys: "sofa", phone: "shelf", glasses: "table", watch: "chair" });
    expect(score).toEqual({ correct: 1, distractorsPlaced: 1 });
  });

  it("passes with enough correct and no distractors", () => {
    const score = scoreRecall(original, { keys: "sofa", phone: "table", glasses: "shelf" });
    expect(isRecallPassed(score, 3)).toBe(true);
    expect(isRecallPassed(score, 4)).toBe(false);
  });

  it("fails when a distractor is placed", () => {
    expect(isRecallPassed({ correct: 4, distractorsPlaced: 1 }, 3)).toBe(false);
  });
});

describe("diary", () => {
  const rules = [{ id: "doctor", slot: "morning" }, { id: "hair" }, { id: "dinner", slot: "evening" }];

  it("round-trips cell ids", () => {
    expect(parseDiaryCell(diaryCellId("mon", "morning"))).toEqual({ day: "mon", slot: "morning" });
  });

  it("accepts a plan that meets every rule", () => {
    const plan = { doctor: "mon:morning", hair: "tue:afternoon", dinner: "wed:evening" };
    expect(checkDiary(plan, rules)).toBe(true);
  });

  it("rejects missing appointments, wrong slots and shared days", () => {
    expect(checkDiary({ doctor: "mon:morning", hair: "tue:morning" }, rules)).toBe(false);
    expect(checkDiary({ doctor: "mon:evening", hair: "tue:morning", dinner: "wed:evening" }, rules)).toBe(false);
    expect(checkDiary({ doctor: "mon:morning", hair: "mon:afternoon", dinner: "wed:evening" }, rules)).toBe(false);
  });
});

describe("drop targets", () => {
  const targets = [
    { id: "sofa", rect: { x: 0, y: 0, width: 100, height: 50 } },
    { id: "table", rect: { x: 200, y: 0, width: 100, height: 50 } },
  ];

  it("finds the target under a point, including its edges", () => {
    expect(spotAtPoint({ x: 250, y: 25 }, targets)?.id).toBe("table");
    expect(spotAtPoint({ x: 100, y: 50 }, targets)?.id).toBe("sofa");
    expect(spotAtPoint({ x: 150, y: 25 }, targets)).toBeUndefined();
  });

  it("computes rect centers", () => {
    expect(rectCenter({ x: 200, y: 0, width: 100, height: 50 })).toEqual({ x: 250, y: 25 });
  });
});

describe("rect helpers", () => {
  const rect = { x: 10, y: 20, width: 100, height: 50 };

  it("offsets without mutating", () => {
    expect(offsetRect(rect, 5, -20)).toEqual({ x: 15, y: 0, width: 100, height: 50 });
    expect(rect.x).toBe(10);
  });

  it("mirrors across a container width", () => {
    expect(mirrorRect(rect, 300)).toEqual({ x: 190, y: 20, width: 100, height: 50 });
    expect(mirrorRect(mirrorRect(rect, 300), 300)).toEqual(rect);
  });

  it("turns a rect into a positioning style", () => {
    expect(rectStyle(rect)).toEqual({ left: 10, top: 20, width: 100, height: 50 });
  });
});
