import type { IMedia } from "@/common/types/Media";
import { getMediaKind, videoPosterUrl } from "@/common/utils/mediaKind";
import { MediaThumb } from "@/components/common/MediaThumb";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  media: IMedia;
  className?: string;
  /** "cover" crops to fill (grid tiles); "contain" shows the whole image (details), and makes videos playable. */
  fit?: "cover" | "contain";
}

export function MediaPreview({ media, className, fit = "cover" }: MediaPreviewProps) {
  if (fit === "contain" && getMediaKind(media.mimeType) === "video") {
    return (
      <video
        src={videoPosterUrl(media.url)}
        controls
        playsInline
        preload="metadata"
        className={cn("size-full bg-black object-contain", className)}
      />
    );
  }
  return <MediaThumb media={media} fit={fit} className={className} />;
}
