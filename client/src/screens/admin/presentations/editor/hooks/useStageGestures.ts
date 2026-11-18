import { useRef } from "react";
import type { OnDrag, OnResize, OnRotate } from "react-moveable";
import type { ISlide } from "@/common/types/Deck";
import type { IFrame } from "@/lib/deck/stageGeometry";
import { commitFrames } from "../editorCommands";

type Target = HTMLElement | SVGElement;

interface IGestureEntry {
  target: Target;
  start: IFrame;
  current: IFrame;
}

function writeFrame(target: Target, frame: IFrame) {
  target.style.left = `${frame.x}px`;
  target.style.top = `${frame.y}px`;
  target.style.width = `${frame.w}px`;
  target.style.height = `${frame.h}px`;
  target.style.transform = frame.rotation ? `rotate(${frame.rotation}deg)` : "";
}

/**
 * Move / resize / rotate handlers for the stage. While a gesture runs, geometry is written straight
 * to the DOM (no store updates, so no re-renders and no undo entries); when it ends, the final
 * frames are committed once. Moveable reports movement as a translation in slide space relative to
 * the gesture start, which is added to the element's stored position.
 */
export function useStageGestures(slide: ISlide) {
  const entries = useRef(new Map<string, IGestureEntry>());

  const entryFor = (target: Target): IGestureEntry | null => {
    const id = target.dataset.stageElement ?? "";
    const known = entries.current.get(id);
    if (known) return known;
    const element = slide.elements.find((el) => el.id === id);
    if (!element) return null;
    const start = { x: element.x, y: element.y, w: element.w, h: element.h, rotation: element.rotation };
    const entry = { target, start, current: start };
    entries.current.set(id, entry);
    return entry;
  };

  const update = (target: Target, change: (start: IFrame, current: IFrame) => IFrame) => {
    const entry = entryFor(target);
    if (!entry) return;
    entry.current = change(entry.start, entry.current);
    writeFrame(target, entry.current);
  };

  const handleDrag = (e: OnDrag) => {
    update(e.target, (start, current) => ({
      ...current,
      x: start.x + e.beforeTranslate[0],
      y: start.y + e.beforeTranslate[1],
    }));
  };

  const handleResize = (e: OnResize) => {
    update(e.target, (start, current) => ({
      ...current,
      x: start.x + e.drag.beforeTranslate[0],
      y: start.y + e.drag.beforeTranslate[1],
      w: e.width,
      h: e.height,
    }));
  };

  const handleRotate = (e: OnRotate) => {
    update(e.target, (start, current) => ({
      ...current,
      // Non-zero only in a group, where each element also orbits the group's centre.
      x: start.x + e.drag.beforeTranslate[0],
      y: start.y + e.drag.beforeTranslate[1],
      rotation: e.rotation,
    }));
  };

  const handleEnd = () => {
    const gesture = [...entries.current.entries()];
    entries.current.clear();
    if (gesture.length === 0) return;
    commitFrames(new Map(gesture.map(([id, entry]) => [id, entry.current])));
  };

  return {
    handleDrag,
    handleResize,
    handleRotate,
    handleEnd,
    handleDragGroup: (e: { events: OnDrag[] }) => e.events.forEach(handleDrag),
    handleResizeGroup: (e: { events: OnResize[] }) => e.events.forEach(handleResize),
    handleRotateGroup: (e: { events: OnRotate[] }) => e.events.forEach(handleRotate),
  };
}
