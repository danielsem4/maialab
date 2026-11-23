import { useTranslation } from "react-i18next";
import type { IProjectImage } from "@/common/types/Project";
import { getMediaKind, videoPosterUrl } from "@/common/utils/mediaKind";
import { cn } from "@/lib/utils";

interface GallerySlideProps {
  item: IProjectImage;
  index: number;
  /** Only the current slide is reachable by keyboard and loads eagerly. */
  active: boolean;
  /** When given, images open the full-screen viewer on click. */
  onOpen?: (index: number) => void;
  className?: string;
}

const MEDIA_CLASS = "max-h-full max-w-full rounded-md object-contain";

/** One carousel slide: an image (optionally opening the viewer) or a video with its own controls. */
export function GallerySlide({ item, index, active, onOpen, className }: GallerySlideProps) {
  const { t } = useTranslation();
  const { media, caption } = item;
  const label = media.alt || caption;

  const handleOpen = () => {
    onOpen?.(index);
  };

  const content =
    getMediaKind(media.mimeType) === "video" ? (
      <video
        src={videoPosterUrl(media.url)}
        controls
        playsInline
        preload="metadata"
        tabIndex={active ? 0 : -1}
        aria-label={label || t("projects.carousel.video")}
        className={cn(MEDIA_CLASS, "bg-black")}
      />
    ) : onOpen ? (
      <button
        type="button"
        onClick={handleOpen}
        tabIndex={active ? 0 : -1}
        aria-label={t("common.enlargeImage")}
        className="flex size-full cursor-zoom-in items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img src={media.url} alt={label} loading={index === 0 ? "eager" : "lazy"} className={MEDIA_CLASS} />
      </button>
    ) : (
      <img src={media.url} alt={label} className={MEDIA_CLASS} />
    );

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={label || undefined}
      aria-hidden={!active}
      className={cn("flex h-full min-w-0 shrink-0 grow-0 basis-full items-center justify-center", className)}
    >
      {content}
    </div>
  );
}
