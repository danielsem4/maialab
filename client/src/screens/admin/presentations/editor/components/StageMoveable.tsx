import { useEffect, useRef } from "react";
import Moveable from "react-moveable";
import type { ISlide } from "@/common/types/Deck";
import { getElementDefinition } from "@/components/deck/elements/registry";
import { STAGE_GUIDELINES } from "@/lib/deck/stageGeometry";
import { useStageGestures } from "../hooks/useStageGestures";

const ALL_DIRECTIONS = { top: true, left: true, bottom: true, right: true, center: true, middle: true };
const ROTATION_SNAPS = Array.from({ length: 24 }, (_, i) => i * 15);
const OTHER_ELEMENTS = '[data-stage-element][data-selected="false"]';

interface StageMoveableProps {
  slide: ISlide;
  selectedIds: string[];
  /** Stage scale; handles are drawn at 1/scale so they keep their size on screen. */
  scale: number;
}

/** Move / resize / rotate handles around the selection, with snapping to the slide and to other elements. */
export function StageMoveable({ slide, selectedIds, scale }: StageMoveableProps) {
  const moveableRef = useRef<Moveable>(null);
  const gestures = useStageGestures(slide);
  const selected = slide.elements.filter((el) => selectedIds.includes(el.id));
  const single = selected.length === 1 ? selected[0] : null;

  // The handles do not notice geometry changed from outside (inspector, undo, nudge, rescale).
  useEffect(() => {
    moveableRef.current?.updateRect();
  }, [slide, scale, selectedIds]);

  if (selected.length === 0) return null;

  return (
    <Moveable
      ref={moveableRef}
      target={selected.map((el) => `[data-stage-element="${CSS.escape(el.id)}"]`)}
      draggable
      resizable
      rotatable
      snappable
      origin={false}
      zoom={1 / scale}
      keepRatio={single ? Boolean(getElementDefinition(single.type)?.keepRatio) : false}
      throttleDrag={0}
      snapThreshold={8}
      isDisplaySnapDigit={false}
      snapDirections={ALL_DIRECTIONS}
      elementSnapDirections={ALL_DIRECTIONS}
      verticalGuidelines={[...STAGE_GUIDELINES.vertical]}
      horizontalGuidelines={[...STAGE_GUIDELINES.horizontal]}
      elementGuidelines={[OTHER_ELEMENTS]}
      snapRotationDegrees={ROTATION_SNAPS}
      snapRotationThreshold={5}
      onDrag={gestures.handleDrag}
      onResize={gestures.handleResize}
      onRotate={gestures.handleRotate}
      onDragEnd={gestures.handleEnd}
      onResizeEnd={gestures.handleEnd}
      onRotateEnd={gestures.handleEnd}
      onDragGroup={gestures.handleDragGroup}
      onResizeGroup={gestures.handleResizeGroup}
      onRotateGroup={gestures.handleRotateGroup}
      onDragGroupEnd={gestures.handleEnd}
      onResizeGroupEnd={gestures.handleEnd}
      onRotateGroupEnd={gestures.handleEnd}
    />
  );
}
