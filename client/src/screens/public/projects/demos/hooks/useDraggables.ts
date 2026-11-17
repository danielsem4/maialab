import { useRef, useState, type PointerEvent } from "react";
import { toLocalPoint, type IPoint } from "@/common/utils/geometry";

/** Pointer position inside `element`, in its unscaled pixels (the device frame is CSS-scaled). */
export function localPointer(event: PointerEvent, element: Element): IPoint {
  const layoutWidth = element instanceof HTMLElement ? element.offsetWidth : element.clientWidth;
  return toLocalPoint(event.clientX, event.clientY, element.getBoundingClientRect(), layoutWidth);
}

/**
 * Drag several items around a positioned container. Positions are item centers in container pixels;
 * render each item with `left/top` at its position and `-translate-x-1/2 -translate-y-1/2`.
 */
export function useDraggables<K extends string>(initial: Record<K, IPoint>, onDrop?: (id: K, point: IPoint) => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState(initial);
  const [activeId, setActiveId] = useState<K | null>(null);
  const grabOffset = useRef<IPoint>({ x: 0, y: 0 });

  function pointerIn(event: PointerEvent): IPoint | null {
    return containerRef.current ? localPointer(event, containerRef.current) : null;
  }

  function handlersFor(id: K) {
    return {
      onPointerDown(event: PointerEvent) {
        const point = pointerIn(event);
        if (!point) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        grabOffset.current = { x: point.x - positions[id].x, y: point.y - positions[id].y };
        setActiveId(id);
      },
      onPointerMove(event: PointerEvent) {
        const point = pointerIn(event);
        if (activeId !== id || !point) return;
        setPositions((current) => ({
          ...current,
          [id]: { x: point.x - grabOffset.current.x, y: point.y - grabOffset.current.y },
        }));
      },
      onPointerUp() {
        if (activeId !== id) return;
        setActiveId(null);
        onDrop?.(id, positions[id]);
      },
      onPointerCancel() {
        setActiveId(null);
      },
      style: { left: positions[id].x, top: positions[id].y, touchAction: "none" as const },
    };
  }

  function moveTo(id: K, point: IPoint) {
    setPositions((current) => ({ ...current, [id]: point }));
  }

  function reset() {
    setPositions(initial);
    setActiveId(null);
  }

  return { containerRef, positions, activeId, handlersFor, moveTo, reset };
}
