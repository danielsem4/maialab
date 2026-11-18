import { describe, expect, it } from "vitest";
import { commandFromKey } from "./shortcuts";

type KeyInit = { key: string; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean };

const key = (init: KeyInit) => commandFromKey({ ctrlKey: false, metaKey: false, shiftKey: false, ...init });

describe("commandFromKey", () => {
  it("deletes", () => {
    expect(key({ key: "Delete" })).toEqual({ kind: "delete" });
    expect(key({ key: "Backspace" })).toEqual({ kind: "delete" });
  });

  it("nudges by 1, or 10 with Shift", () => {
    expect(key({ key: "ArrowLeft" })).toEqual({ kind: "nudge", dx: -1, dy: 0 });
    expect(key({ key: "ArrowRight" })).toEqual({ kind: "nudge", dx: 1, dy: 0 });
    expect(key({ key: "ArrowUp" })).toEqual({ kind: "nudge", dx: 0, dy: -1 });
    expect(key({ key: "ArrowDown", shiftKey: true })).toEqual({ kind: "nudge", dx: 0, dy: 10 });
  });

  it("undoes and redoes", () => {
    expect(key({ key: "z", ctrlKey: true })).toEqual({ kind: "undo" });
    expect(key({ key: "z", metaKey: true })).toEqual({ kind: "undo" });
    expect(key({ key: "Z", ctrlKey: true, shiftKey: true })).toEqual({ kind: "redo" });
    expect(key({ key: "z", metaKey: true, shiftKey: true })).toEqual({ kind: "redo" });
    expect(key({ key: "y", ctrlKey: true })).toEqual({ kind: "redo" });
  });

  it("duplicates and deselects", () => {
    expect(key({ key: "d", ctrlKey: true })).toEqual({ kind: "duplicate" });
    expect(key({ key: "Escape" })).toEqual({ kind: "deselect" });
  });

  it("moves layers", () => {
    expect(key({ key: "]" })).toEqual({ kind: "layer", move: "forward" });
    expect(key({ key: "[" })).toEqual({ kind: "layer", move: "backward" });
    expect(key({ key: "]", ctrlKey: true })).toEqual({ kind: "layer", move: "front" });
    expect(key({ key: "[", metaKey: true })).toEqual({ kind: "layer", move: "back" });
  });

  it("ignores everything else", () => {
    expect(key({ key: "a" })).toBeNull();
    expect(key({ key: "s", ctrlKey: true })).toBeNull();
    expect(key({ key: "z" })).toBeNull();
    expect(key({ key: "Delete", ctrlKey: true })).toBeNull();
  });
});
