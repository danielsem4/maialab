import { useRef, useState, type PointerEvent } from "react";
import type { IPoint } from "@/common/utils/geometry";
import { localPointer } from "./useDraggables";

/** Freehand drawing on an SVG. Each stroke is a list of points in the SVG's unscaled pixels. */
export function useFreehand(onStrokeEnd?: (stroke: IPoint[]) => void) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<IPoint[][]>([]);
  const [current, setCurrent] = useState<IPoint[] | null>(null);

  function pointerIn(event: PointerEvent): IPoint | null {
    return svgRef.current ? localPointer(event, svgRef.current) : null;
  }

  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    const point = pointerIn(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setCurrent([point]);
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const point = pointerIn(event);
    if (!current || !point) return;
    setCurrent([...current, point]);
  }

  function onPointerUp() {
    if (!current) return;
    setStrokes((all) => [...all, current]);
    setCurrent(null);
    onStrokeEnd?.(current);
  }

  function clear() {
    setStrokes([]);
    setCurrent(null);
  }

  const allStrokes = current ? [...strokes, current] : strokes;
  const handlers = { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, style: { touchAction: "none" as const } };

  return { svgRef, strokes: allStrokes, handlers, clear };
}
