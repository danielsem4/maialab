import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { snapToStep } from "@/common/utils/orientationUtils";
import { localPointer } from "./useDraggables";

const KEY_DELTAS: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };

/**
 * A pointer- and keyboard-driven slider snapped to whole steps. Pointer events go on the track
 * container (which must be laid out left-to-right); `moved` becomes true after the first change.
 */
export function useScaleSlider(min: number, max: number, step = 1) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [value, setValue] = useState(min);
  const [moved, setMoved] = useState(false);

  function change(next: number) {
    setValue(next);
    setMoved(true);
  }

  function valueAt(event: PointerEvent): number | null {
    const track = trackRef.current;
    if (!track || track.offsetWidth === 0) return null;
    const { x } = localPointer(event, track);
    return snapToStep(min + (x / track.offsetWidth) * (max - min), min, max, step);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const next = valueAt(event);
    if (next === null) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    change(next);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const next = valueAt(event);
    if (next !== null && next !== value) change(next);
  }

  function onPointerUp() {
    dragging.current = false;
  }

  function onKeyDown(event: KeyboardEvent) {
    const delta = KEY_DELTAS[event.key];
    const target = event.key === "Home" ? min : event.key === "End" ? max : delta === undefined ? null : value + delta * step;
    if (target === null) return;
    event.preventDefault();
    change(snapToStep(target, min, max, step));
  }

  const trackHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    style: { touchAction: "none" as const },
  };

  return {
    trackRef,
    value,
    moved,
    percent: ((value - min) / (max - min)) * 100,
    trackHandlers,
    thumbHandlers: { onKeyDown },
  };
}
