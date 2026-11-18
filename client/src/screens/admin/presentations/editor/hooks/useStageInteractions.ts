import type { PointerEvent } from "react";
import { flushSync } from "react-dom";
import { useDeckEditorStore } from "@/store/useDeckEditorStore";

/** Anything that belongs to an element or to the move/resize handles drawn around the selection. */
const NOT_BACKGROUND = "[data-stage-element], .moveable-control-box";

/** Pointer selection on the stage: click selects, Shift+click toggles, clicking empty space clears. */
export function useStageInteractions() {
  const select = useDeckEditorStore((s) => s.select);

  const handleElementPointerDown = (event: PointerEvent, id: string) => {
    if (event.button !== 0) return;
    const { selectedIds, editingTextId } = useDeckEditorStore.getState();
    if (editingTextId === id) return;
    const isSelected = selectedIds.includes(id);
    if (!event.shiftKey && isSelected) return;
    const next = event.shiftKey
      ? isSelected
        ? selectedIds.filter((other) => other !== id)
        : [...selectedIds, id]
      : [id];
    // Rendered synchronously so the drag handles are attached before the browser's mousedown that
    // follows this pointerdown: press-and-drag on an unselected element then moves it in one go.
    flushSync(() => select(next));
  };

  const handleBackgroundPointerDown = (event: PointerEvent) => {
    if (event.target instanceof Element && event.target.closest(NOT_BACKGROUND)) return;
    select([]);
  };

  return { handleElementPointerDown, handleBackgroundPointerDown };
}
