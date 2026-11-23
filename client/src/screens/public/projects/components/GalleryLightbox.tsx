import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IProjectImage } from "@/common/types/Project";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCarousel } from "@/hooks/common/useCarousel";
import { GalleryStage } from "./GalleryStage";

interface GalleryLightboxProps {
  items: IProjectImage[];
  startIndex: number;
  /** Called with the slide the visitor was on when they closed the viewer. */
  onClose: (index: number) => void;
}

/** Full-screen viewer over the page: the same slides on a dark backdrop, as large as the screen allows. */
export function GalleryLightbox({ items, startIndex, onClose }: GalleryLightboxProps) {
  const { t } = useTranslation();
  const [viewportRef, carousel] = useCarousel(startIndex);
  const current = items[carousel.selectedIndex];

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose(carousel.selectedIndex);
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="dark flex h-dvh w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-black/95 p-0 text-white sm:max-w-none"
      >
        <DialogTitle className="sr-only">{t("projects.carousel.viewer")}</DialogTitle>
        <DialogDescription className="sr-only">{current?.caption || t("projects.gallery")}</DialogDescription>
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <span className="text-sm tabular-nums text-white/70">
            {t("projects.carousel.counter", { current: carousel.selectedIndex + 1, total: items.length })}
          </span>
          <DialogClose
            aria-label={t("projects.carousel.close")}
            className="flex size-11 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <X className="size-6" />
          </DialogClose>
        </div>
        <GalleryStage
          items={items}
          viewportRef={viewportRef}
          carousel={carousel}
          className="min-h-0 flex-1 [&>div:first-child]:h-full"
          trackClassName="h-full"
          slideClassName="p-2 sm:px-16"
        />
        <p dir="auto" className="min-h-12 px-4 py-3 text-center text-sm text-white/80">
          {current?.caption}
        </p>
      </DialogContent>
    </Dialog>
  );
}
