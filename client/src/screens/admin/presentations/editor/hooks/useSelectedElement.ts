import { getElementDefinition } from "@/components/deck/elements/registry";
import { selectCurrentSlide, useDeckEditorStore } from "@/store/useDeckEditorStore";

/** The current slide's selection, plus the single selected element and its definition when there is exactly one. */
export function useSelectedElement() {
  const slide = useDeckEditorStore(selectCurrentSlide);
  const theme = useDeckEditorStore((s) => s.doc?.theme ?? null);
  const selectedIds = useDeckEditorStore((s) => s.selectedIds);
  const selected = slide ? slide.elements.filter((el) => selectedIds.includes(el.id)) : [];
  const element = selected.length === 1 ? selected[0] : null;

  return {
    slide,
    theme,
    selectedCount: selected.length,
    element,
    definition: element ? getElementDefinition(element.type) : null,
  };
}
