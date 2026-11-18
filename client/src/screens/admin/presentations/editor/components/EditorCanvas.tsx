import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { MediaPicker } from "@/components/common/MediaPicker";
import { getElementDefinition } from "@/components/deck/elements/registry";
import { useImageInsert } from "../hooks/useImageInsert";
import { usePaletteDrop } from "../hooks/usePaletteDrop";
import { Palette } from "./Palette";
import { Stage } from "./Stage";

/** The palette and the stage share one drag context so palette items can be dropped onto the slide. */
export function EditorCanvas() {
  const { t } = useTranslation();
  const image = useImageInsert();
  const palette = usePaletteDrop(image.requestImage);
  const dragged = palette.activeType ? getElementDefinition(palette.activeType) : null;
  const DraggedIcon = dragged?.icon;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <DndContext
        sensors={palette.sensors}
        onDragStart={palette.handleDragStart}
        onDragEnd={palette.handleDragEnd}
        onDragCancel={palette.handleDragCancel}
      >
        <Palette onAdd={palette.handleAdd} />
        <Stage />
        <DragOverlay dropAnimation={null}>
          {dragged && DraggedIcon && (
            <div className="flex w-fit items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm shadow-lg">
              <DraggedIcon className="size-4" aria-hidden="true" />
              {t(dragged.labelKey)}
            </div>
          )}
        </DragOverlay>
      </DndContext>
      <MediaPicker open={image.isPickerOpen} onOpenChange={image.handleOpenChange} onSelect={image.handleSelect} />
    </div>
  );
}
