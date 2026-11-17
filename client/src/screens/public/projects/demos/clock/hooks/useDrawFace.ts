import { useState } from "react";
import { isRoughCircle } from "@/common/utils/clockUtils";
import { useFreehand } from "../../hooks/useFreehand";

const MAX_ATTEMPTS = 3;

/** Freehand clock-face drawing: "Done" scores all strokes together as one circle, with a few attempts. */
export function useDrawFace(onComplete: (passed: boolean) => void) {
  const [attempts, setAttempts] = useState(0);
  const { svgRef, strokes, handlers, clear } = useFreehand();

  function handleDone() {
    if (isRoughCircle(strokes.flat())) {
      onComplete(true);
      return;
    }
    if (attempts + 1 >= MAX_ATTEMPTS) {
      onComplete(false);
      return;
    }
    setAttempts(attempts + 1);
    clear();
  }

  return { svgRef, strokes, handlers, clear, handleDone, hasDrawing: strokes.length > 0, showHint: attempts > 0 };
}
