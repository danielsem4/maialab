import { useState } from "react";
import { PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { toLocalPoint, type IPoint } from "@/common/utils/geometry";
import { IMAGE_TYPE } from "@/components/deck/elements/registry";
import { SLIDE_WIDTH } from "@/lib/deck/deckDoc";
import { insertElement } from "../editorCommands";

export const STAGE_DROP_ID = "deck-stage";

/** Where the pointer was released, in slide coordinates. */
function dropPoint(event: DragEndEvent): IPoint | undefined {
  const { activatorEvent, delta, over } = event;
  if (!over || !(activatorEvent instanceof MouseEvent)) return undefined;
  const stageRect = { x: over.rect.left, y: over.rect.top, width: over.rect.width, height: over.rect.height };
  return toLocalPoint(activatorEvent.clientX + delta.x, activatorEvent.clientY + delta.y, stageRect, SLIDE_WIDTH);
}

/** Adding elements from the palette: click puts one in the slide centre, drag puts it where it is dropped. */
export function usePaletteDrop(requestImage: (center?: IPoint) => void) {
  const [activeType, setActiveType] = useState<string | null>(null);
  // The distance threshold keeps a plain click a click.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const add = (type: string, center?: IPoint) => {
    if (type === IMAGE_TYPE) requestImage(center);
    else insertElement(type, center);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveType(String(event.active.data.current?.type ?? ""));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveType(null);
    const type = event.active.data.current?.type;
    if (event.over?.id === STAGE_DROP_ID && typeof type === "string") add(type, dropPoint(event));
  };

  const handleDragCancel = () => {
    setActiveType(null);
  };

  const handleAdd = (type: string) => {
    add(type);
  };

  return { sensors, activeType, handleDragStart, handleDragEnd, handleDragCancel, handleAdd };
}
