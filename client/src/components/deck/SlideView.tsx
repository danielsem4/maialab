import type { IDeckTheme, ISlide } from "@/common/types/Deck";
import { slideSurfaceStyle } from "@/lib/deck/slideStyles";
import { ElementView } from "./ElementView";

interface SlideViewProps {
  slide: ISlide;
  theme: IDeckTheme;
}

/** Read-only slide at its natural 1920×1080 size; callers scale it. Always LTR so RTL UI never moves elements. */
export function SlideView({ slide, theme }: SlideViewProps) {
  return (
    <div dir="ltr" style={slideSurfaceStyle(theme, slide.background)}>
      {slide.elements.map((element) => (
        <ElementView key={element.id} element={element} theme={theme} />
      ))}
    </div>
  );
}
