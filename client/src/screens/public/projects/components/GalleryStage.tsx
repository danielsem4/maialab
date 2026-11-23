import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IProjectImage } from "@/common/types/Project";
import type { CarouselState, CarouselViewportRef } from "@/hooks/common/useCarousel";
import { cn } from "@/lib/utils";
import { GallerySlide } from "./GallerySlide";

interface GalleryStageProps {
  items: IProjectImage[];
  viewportRef: CarouselViewportRef;
  carousel: CarouselState;
  onOpen?: (index: number) => void;
  /** Sizing of the sliding track (its height is what keeps mixed media from jumping the layout). */
  trackClassName: string;
  slideClassName?: string;
  className?: string;
}

const ARROW_CLASS =
  "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border bg-background/85 text-foreground shadow-md backdrop-blur-sm transition hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-0";

/** The sliding area of the gallery with its previous/next buttons. Swipe, buttons and arrow keys all move it. */
export function GalleryStage({
  items,
  viewportRef,
  carousel,
  onOpen,
  trackClassName,
  slideClassName,
  className,
}: GalleryStageProps) {
  const { t } = useTranslation();
  const { selectedIndex } = carousel;
  const hasMany = items.length > 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("projects.gallery")}
      onKeyDown={carousel.handleKeyDown}
      className={cn("relative", className)}
    >
      <div ref={viewportRef} className="overflow-hidden">
        <div className={cn("flex touch-pan-y", trackClassName)}>
          {items.map((item, index) => (
            <GallerySlide
              key={item.mediaId}
              item={item}
              index={index}
              active={index === selectedIndex}
              onOpen={onOpen}
              className={slideClassName}
            />
          ))}
        </div>
      </div>
      {hasMany && (
        <>
          <button
            type="button"
            onClick={carousel.handlePrev}
            disabled={selectedIndex === 0}
            aria-label={t("projects.carousel.previous")}
            className={cn(ARROW_CLASS, "start-2 sm:start-3")}
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={carousel.handleNext}
            disabled={selectedIndex === items.length - 1}
            aria-label={t("projects.carousel.next")}
            className={cn(ARROW_CLASS, "end-2 sm:end-3")}
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>
        </>
      )}
    </div>
  );
}
