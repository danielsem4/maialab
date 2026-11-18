import { useDraggable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import type { IElementDefinition } from "@/components/deck/elements/types";
import { cn } from "@/lib/utils";

interface PaletteItemProps {
  definition: IElementDefinition;
  onAdd: (type: string) => void;
}

/** Click (or Enter) adds the element in the slide centre; dragging it onto the slide places it there. */
export function PaletteItem({ definition, onAdd }: PaletteItemProps) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${definition.type}`,
    data: { type: definition.type },
  });
  const Icon = definition.icon;

  const handleClick = () => {
    onAdd(definition.type);
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={handleClick}
      className={cn(
        "flex cursor-grab touch-none items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        isDragging && "opacity-50",
      )}
      {...attributes}
      {...listeners}
    >
      <Icon className="size-4" aria-hidden="true" />
      {t(definition.labelKey)}
    </button>
  );
}
