import type { IDeckTheme, ISlide } from "@/common/types/Deck";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/deck/deckDoc";
import { SlideView } from "./SlideView";

interface ScaledSlideProps {
  slide: ISlide;
  theme: IDeckTheme;
  scale: number;
  className?: string;
}

/** A read-only slide shrunk to `scale`, taking up exactly its scaled size in the layout. */
export function ScaledSlide({ slide, theme, scale, className }: ScaledSlideProps) {
  return (
    <div
      dir="ltr"
      className={className}
      style={{ width: SLIDE_WIDTH * scale, height: SLIDE_HEIGHT * scale, overflow: "hidden" }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <SlideView slide={slide} theme={theme} />
      </div>
    </div>
  );
}
