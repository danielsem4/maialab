import { useState } from "react";
import type { IPoint } from "@/common/utils/geometry";
import {
  itemAt,
  placeItem,
  rectCenter,
  removeItem,
  spotAtPoint,
  type IDropTarget,
  type Placements,
} from "@/common/utils/memoryUtils";
import { useDraggables } from "../../hooks/useDraggables";

export type DragHandlers = ReturnType<ReturnType<typeof useDraggables<string>>["handlersFor"]>;

/**
 * Drag items from a tray onto drop targets. An item dropped on a free target snaps to its center and
 * is recorded in `placements`; dropped anywhere else (or on an occupied target) it slides back to its
 * fixed tray position. Positions are item centers in container pixels (see `useDraggables`).
 */
export function useDragPlacement(trayPositions: Record<string, IPoint>, targets: IDropTarget[]) {
  const [placements, setPlacements] = useState<Placements>({});
  const { containerRef, positions, activeId, handlersFor, moveTo } = useDraggables(trayPositions, handleDrop);

  /** The target under `point` if `id` may be dropped there (free, or already holding `id`). */
  function droppableAt(id: string, point: IPoint): IDropTarget | undefined {
    const target = spotAtPoint(point, targets);
    if (!target) return undefined;
    const occupant = itemAt(placements, target.id);
    return occupant === undefined || occupant === id ? target : undefined;
  }

  function handleDrop(id: string, point: IPoint) {
    const target = droppableAt(id, point);
    if (target) {
      moveTo(id, rectCenter(target.rect));
      setPlacements(placeItem(placements, id, target.id));
      return;
    }
    moveTo(id, trayPositions[id]);
    setPlacements(removeItem(placements, id));
  }

  const hovered = activeId ? droppableAt(activeId, positions[activeId]) : undefined;
  const allPlaced = Object.keys(trayPositions).every((id) => id in placements);

  return { containerRef, placements, activeId, hoverTargetId: hovered ? hovered.id : null, handlersFor, allPlaced };
}
