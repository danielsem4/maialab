import type { LayerMove } from "./deckOps";

export type EditorCommand =
  | { kind: "delete" }
  | { kind: "duplicate" }
  | { kind: "undo" }
  | { kind: "redo" }
  | { kind: "nudge"; dx: number; dy: number }
  | { kind: "layer"; move: LayerMove }
  | { kind: "deselect" };

type KeyInfo = Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "shiftKey">;

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const NUDGE_STEP = 1;
const NUDGE_STEP_LARGE = 10;

function withModifier(key: string, shift: boolean): EditorCommand | null {
  if (key === "z") return { kind: shift ? "redo" : "undo" };
  if (key === "y") return { kind: "redo" };
  if (key === "d") return { kind: "duplicate" };
  if (key === "]") return { kind: "layer", move: "front" };
  if (key === "[") return { kind: "layer", move: "back" };
  return null;
}

/** Maps a key press to an editor command. The caller decides whether the target is editable text. */
export function commandFromKey(e: KeyInfo): EditorCommand | null {
  if (e.ctrlKey || e.metaKey) return withModifier(e.key.toLowerCase(), e.shiftKey);
  if (e.key === "Delete" || e.key === "Backspace") return { kind: "delete" };
  if (e.key === "Escape") return { kind: "deselect" };
  if (e.key === "]") return { kind: "layer", move: "forward" };
  if (e.key === "[") return { kind: "layer", move: "backward" };
  const arrow = ARROWS[e.key];
  if (!arrow) return null;
  const step = e.shiftKey ? NUDGE_STEP_LARGE : NUDGE_STEP;
  // `|| 0` avoids -0, which reads oddly in tests and logs.
  return { kind: "nudge", dx: arrow[0] * step || 0, dy: arrow[1] * step || 0 };
}
