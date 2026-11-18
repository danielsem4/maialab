import type { ISlide } from "@/common/types/Deck";
import { useDeckEditorStore } from "@/store/useDeckEditorStore";

export function useSlideStrip() {
  const doc = useDeckEditorStore((s) => s.doc);
  const currentSlideId = useDeckEditorStore((s) => s.currentSlideId);
  const selectSlide = useDeckEditorStore((s) => s.selectSlide);
  const addSlide = useDeckEditorStore((s) => s.addSlide);
  const duplicateSlide = useDeckEditorStore((s) => s.duplicateSlide);
  const removeSlide = useDeckEditorStore((s) => s.removeSlide);
  const reorderSlides = useDeckEditorStore((s) => s.reorderSlides);
  const slides = doc?.slides ?? [];

  const handleDuplicate = () => {
    if (currentSlideId) duplicateSlide(currentSlideId);
  };

  const handleDelete = () => {
    if (currentSlideId) removeSlide(currentSlideId);
  };

  const handleReorder = (next: ISlide[]) => {
    reorderSlides(next.map((slide) => slide.id));
  };

  return {
    slides,
    theme: doc?.theme ?? null,
    currentSlideId,
    canDelete: slides.length > 1,
    handleSelect: selectSlide,
    handleAdd: addSlide,
    handleDuplicate,
    handleDelete,
    handleReorder,
  };
}
