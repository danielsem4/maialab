import { useState } from "react";
import { isSequenceMatch } from "@/common/utils/hitberUtils";
import type { ShapeKind } from "../../components/ShapeIcon";

export type FollowShapeId = "blueSquare" | "redCircle" | "greenTriangle" | "redSquare" | "greenCircle" | "blueTriangle";

export interface IFollowShape {
  id: FollowShapeId;
  kind: ShapeKind;
  fillClassName: string;
}

/** Laid out so the three targets are not next to each other, with same-color and same-shape distractors. */
export const FOLLOW_SHAPES: IFollowShape[] = [
  { id: "redCircle", kind: "circle", fillClassName: "fill-red-500" },
  { id: "blueTriangle", kind: "triangle", fillClassName: "fill-blue-500" },
  { id: "greenCircle", kind: "circle", fillClassName: "fill-emerald-500" },
  { id: "redSquare", kind: "square", fillClassName: "fill-red-500" },
  { id: "greenTriangle", kind: "triangle", fillClassName: "fill-emerald-500" },
  { id: "blueSquare", kind: "square", fillClassName: "fill-blue-500" },
];

const TARGET_ORDER: FollowShapeId[] = ["blueSquare", "redCircle", "greenTriangle"];

/** Records taps; after three taps the task passes only if they match the instruction's order. */
export function useFollowInstructions(onComplete: (passed: boolean) => void) {
  const [taps, setTaps] = useState<FollowShapeId[]>([]);

  function handleSelect(id: FollowShapeId) {
    if (taps.includes(id)) return;
    const next = [...taps, id];
    if (next.length >= TARGET_ORDER.length) {
      onComplete(isSequenceMatch(TARGET_ORDER, next));
      return;
    }
    setTaps(next);
  }

  return { taps, handleSelect };
}
