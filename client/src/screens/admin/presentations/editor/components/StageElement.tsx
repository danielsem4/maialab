import type { PointerEvent } from "react";
import type { IDeckElement, IDeckTheme, ITextProps } from "@/common/types/Deck";
import { ElementBody } from "@/components/deck/ElementBody";
import { elementBoxStyle } from "@/lib/deck/slideStyles";
import { cn } from "@/lib/utils";
import { TextEditorBox } from "./TextEditorBox";

interface StageElementProps {
  element: IDeckElement;
  theme: IDeckTheme;
  isSelected: boolean;
  /** The element's text is being edited in place. */
  isEditing: boolean;
  onPointerDown: (event: PointerEvent, id: string) => void;
  onDoubleClick: (id: string, type: string) => void;
}

/** An element on the editable stage. `data-stage-element` is how the move/resize handles find it. */
export function StageElement({ element, theme, isSelected, isEditing, onPointerDown, onDoubleClick }: StageElementProps) {
  const handlePointerDown = (event: PointerEvent) => {
    onPointerDown(event, element.id);
  };

  const handleDoubleClick = () => {
    onDoubleClick(element.id, element.type);
  };

  return (
    <div
      data-stage-element={element.id}
      data-selected={isSelected}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      className={cn(!isEditing && "cursor-move touch-none select-none")}
      style={elementBoxStyle(element)}
    >
      {isEditing ? (
        // Only text elements enter edit mode; the store keeps props untyped per element type.
        <TextEditorBox element={element as unknown as IDeckElement<ITextProps>} />
      ) : (
        <ElementBody element={element} theme={theme} />
      )}
    </div>
  );
}
