import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";

/** Dragging over a video is left to its own controls (scrubbing the timeline must not change slide). */
function allowDrag(_api: unknown, event: MouseEvent | TouchEvent): boolean {
  return !(event.target instanceof Element && event.target.closest("video"));
}

/**
 * One-slide-at-a-time carousel: the ref for the scrolling viewport, and its state (current index, navigation
 * handlers). Videos that scroll away are paused.
 */
export function useCarousel(startIndex = 0) {
  const { i18n } = useTranslation();
  const direction = i18n.dir();
  const [viewportRef, api] = useEmblaCarousel({ direction, startIndex, watchDrag: allowDrag });
  const [selectedIndex, setSelectedIndex] = useState(startIndex);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
      api.rootNode().querySelectorAll("video").forEach((video) => video.pause());
    };
    api.on("select", handleSelect).on("reInit", handleSelect);
    return () => {
      api.off("select", handleSelect).off("reInit", handleSelect);
    };
  }, [api]);

  const handlePrev = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  const scrollTo = (index: number, jump = false) => {
    api?.scrollTo(index, jump);
  };

  /** Arrow keys follow the reading direction: the "forward" arrow always goes to the next slide. */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.target instanceof HTMLVideoElement) return;
    const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (event.key === forward) api?.scrollNext();
    if (event.key === backward) api?.scrollPrev();
  };

  return [viewportRef, { selectedIndex, handlePrev, handleNext, scrollTo, handleKeyDown }] as const;
}

export type CarouselViewportRef = ReturnType<typeof useCarousel>[0];
export type CarouselState = ReturnType<typeof useCarousel>[1];
