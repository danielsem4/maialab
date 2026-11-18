import { useDroppable } from "@dnd-kit/core";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/deck/deckDoc";
import { slideSurfaceStyle } from "@/lib/deck/slideStyles";
import { useContainScale } from "@/hooks/common/useContainScale";
import { selectCurrentSlide, useDeckEditorStore } from "@/store/useDeckEditorStore";
import { STAGE_DROP_ID } from "../hooks/usePaletteDrop";
import { useStageInteractions } from "../hooks/useStageInteractions";
import { StageElement } from "./StageElement";
import { StageMoveable } from "./StageMoveable";
import "../editor.css";

const STAGE_PADDING = 48;

/**
 * The editable slide. Everything inside works in 1920×1080 slide space and is shrunk with one CSS
 * transform; it is always LTR so an RTL interface never moves elements.
 */
export function Stage() {
  const { containerRef, scale } = useContainScale<HTMLDivElement>(STAGE_PADDING);
  const { setNodeRef } = useDroppable({ id: STAGE_DROP_ID });
  const slide = useDeckEditorStore(selectCurrentSlide);
  const theme = useDeckEditorStore((s) => s.doc?.theme);
  const selectedIds = useDeckEditorStore((s) => s.selectedIds);
  const editingTextId = useDeckEditorStore((s) => s.editingTextId);
  const { handleElementPointerDown, handleBackgroundPointerDown } = useStageInteractions();

  return (
    <div
      ref={containerRef}
      onPointerDown={handleBackgroundPointerDown}
      className="deck-stage flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-muted/40"
    >
      {slide && theme && (
        <div
          ref={setNodeRef}
          dir="ltr"
          className="relative shrink-0 shadow-lg"
          style={{ width: SLIDE_WIDTH * scale, height: SLIDE_HEIGHT * scale }}
        >
          {/* Not clipped itself, so handles of elements that poke out of the slide stay reachable. */}
          <div
            className="absolute start-0 top-0"
            style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            <div style={slideSurfaceStyle(theme, slide.background)}>
              {slide.elements.map((element) => (
                <StageElement
                  key={element.id}
                  element={element}
                  theme={theme}
                  isSelected={selectedIds.includes(element.id)}
                  onPointerDown={handleElementPointerDown}
                />
              ))}
            </div>
            {!editingTextId && <StageMoveable slide={slide} selectedIds={selectedIds} scale={scale} />}
          </div>
        </div>
      )}
    </div>
  );
}
