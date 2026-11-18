import type { PointerEvent } from "react";
import type { IDeckElement, IDeckTheme } from "@/common/types/Deck";
import { ElementBody } from "@/components/deck/ElementBody";
import { elementBoxStyle } from "@/lib/deck/slideStyles";

interface StageElementProps {
  element: IDeckElement;
  theme: IDeckTheme;
  isSelected: boolean;
  onPointerDown: (event: PointerEvent, id: string) => void;
}

/** An element on the editable stage. `data-stage-element` is how the move/resize handles find it. */
export function StageElement({ element, theme, isSelected, onPointerDown }: StageElementProps) {
  const handlePointerDown = (event: PointerEvent) => {
    onPointerDown(event, element.id);
  };

  return (
    <div
      data-stage-element={element.id}
      data-selected={isSelected}
      onPointerDown={handlePointerDown}
      className="cursor-move touch-none select-none"
      style={elementBoxStyle(element)}
    >
      <ElementBody element={element} theme={theme} />
    </div>
  );
}
