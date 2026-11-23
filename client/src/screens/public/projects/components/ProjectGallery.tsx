import { useTranslation } from "react-i18next";
import type { IProjectImage } from "@/common/types/Project";
import { useProjectGallery } from "../hooks/useProjectGallery";
import { GalleryLightbox } from "./GalleryLightbox";
import { GalleryStage } from "./GalleryStage";
import { GalleryThumbs } from "./GalleryThumbs";

interface ProjectGalleryProps {
  images: IProjectImage[];
}

/** The project's images and videos as one carousel: a framed stage, caption and counter, and a thumbnail strip. */
export function ProjectGallery({ images }: ProjectGalleryProps) {
  const { t } = useTranslation();
  const { viewportRef, carousel, viewerIndex, handleOpenViewer, handleCloseViewer } = useProjectGallery();

  if (images.length === 0) return null;

  const hasMany = images.length > 1;
  const current = images[carousel.selectedIndex];

  return (
    <section aria-label={t("projects.gallery")} className="space-y-3">
      <div className="overflow-hidden rounded-xl glass">
        <GalleryStage
          items={images}
          viewportRef={viewportRef}
          carousel={carousel}
          onOpen={handleOpenViewer}
          className="bg-primary/10"
          trackClassName="aspect-[4/3] sm:aspect-video"
          slideClassName="p-2 sm:p-4"
        />
      </div>
      {(current?.caption || hasMany) && (
        <div className="flex items-start justify-between gap-4 px-1 text-sm">
          <p dir="auto" className="min-w-0 text-start text-muted-foreground">
            {current?.caption}
          </p>
          {hasMany && (
            <span className="shrink-0 font-medium tabular-nums text-foreground/70" aria-live="polite">
              {t("projects.carousel.counter", { current: carousel.selectedIndex + 1, total: images.length })}
            </span>
          )}
        </div>
      )}
      {hasMany && <GalleryThumbs items={images} selectedIndex={carousel.selectedIndex} onSelect={carousel.scrollTo} />}
      {viewerIndex !== null && <GalleryLightbox items={images} startIndex={viewerIndex} onClose={handleCloseViewer} />}
    </section>
  );
}
