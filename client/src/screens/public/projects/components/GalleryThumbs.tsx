import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { IProjectImage } from "@/common/types/Project";
import { MediaThumb } from "@/components/common/MediaThumb";
import { cn } from "@/lib/utils";

interface GalleryThumbsProps {
  items: IProjectImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

interface GalleryThumbProps {
  item: IProjectImage;
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
}

function GalleryThumb({ item, index, active, onSelect }: GalleryThumbProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    onSelect(index);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("projects.carousel.goTo", { index: index + 1 })}
      aria-current={active}
      className={cn(
        "size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-primary/10 transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:size-20",
        active ? "border-primary" : "border-transparent opacity-60 hover:opacity-100",
      )}
    >
      <MediaThumb media={item.media} />
    </button>
  );
}

/** Scrollable strip of thumbnails under the stage; the current one is outlined and kept in view. */
export function GalleryThumbs({ items, selectedIndex, onSelect }: GalleryThumbsProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Scroll only the strip itself (not the page) so the current thumbnail sits in the middle.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[selectedIndex];
    if (!strip || !(thumb instanceof HTMLElement)) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [selectedIndex]);

  return (
    <div ref={stripRef} className="relative flex gap-2 overflow-x-auto p-1">
      {items.map((item, index) => (
        <GalleryThumb key={item.mediaId} item={item} index={index} active={index === selectedIndex} onSelect={onSelect} />
      ))}
    </div>
  );
}
