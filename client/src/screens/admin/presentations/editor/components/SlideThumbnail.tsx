import { useTranslation } from "react-i18next";
import type { IDeckTheme, ISlide } from "@/common/types/Deck";
import { ScaledSlide } from "@/components/deck/ScaledSlide";
import { cn } from "@/lib/utils";

const THUMBNAIL_SCALE = 0.1;

interface SlideThumbnailProps {
  slide: ISlide;
  theme: IDeckTheme;
  index: number;
  isCurrent: boolean;
  onSelect: (id: string) => void;
}

export function SlideThumbnail({ slide, theme, index, isCurrent, onSelect }: SlideThumbnailProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    onSelect(slide.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("decks.editor.slideNumber", { number: index + 1 })}
      aria-current={isCurrent}
      className={cn(
        "relative block overflow-hidden rounded border bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isCurrent && "ring-2 ring-primary",
      )}
    >
      <ScaledSlide slide={slide} theme={theme} scale={THUMBNAIL_SCALE} className="pointer-events-none" />
      <span className="absolute start-1 bottom-1 rounded bg-black/60 px-1.5 text-xs text-white">{index + 1}</span>
    </button>
  );
}
