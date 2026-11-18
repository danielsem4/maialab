import { ScaledSlide } from "@/components/deck/ScaledSlide";
import { useContainScale } from "@/hooks/common/useContainScale";
import { selectCurrentSlide, useDeckEditorStore } from "@/store/useDeckEditorStore";

const STAGE_PADDING = 48;

export function Stage() {
  const { containerRef, scale } = useContainScale<HTMLDivElement>(STAGE_PADDING);
  const slide = useDeckEditorStore(selectCurrentSlide);
  const theme = useDeckEditorStore((s) => s.doc?.theme);

  return (
    <div ref={containerRef} className="flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-muted/40">
      {slide && theme && <ScaledSlide slide={slide} theme={theme} scale={scale} className="shadow-lg" />}
    </div>
  );
}
