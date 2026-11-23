import { FileText, Play } from "lucide-react";
import type { IMedia } from "@/common/types/Media";
import { getMediaKind, videoPosterUrl } from "@/common/utils/mediaKind";
import { cn } from "@/lib/utils";

interface MediaThumbProps {
  media: IMedia;
  className?: string;
  /** "cover" crops to fill (tiles); "contain" shows the whole picture. */
  fit?: "cover" | "contain";
}

/** Small still preview of any uploaded file: the image, a video's first frame with a play badge, or a file icon. */
export function MediaThumb({ media, className, fit = "cover" }: MediaThumbProps) {
  const kind = getMediaKind(media.mimeType);
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  if (kind === "image") {
    return <img src={media.url} alt={media.alt} loading="lazy" className={cn("size-full", fitClass, className)} />;
  }

  if (kind === "video") {
    return (
      <span className={cn("relative block size-full bg-black", className)}>
        <video src={videoPosterUrl(media.url)} muted playsInline preload="metadata" tabIndex={-1} className={cn("size-full", fitClass)} />
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="flex size-1/3 max-h-9 min-h-5 max-w-9 min-w-5 items-center justify-center rounded-full bg-black/60 text-white">
            <Play className="size-1/2 fill-current" />
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn("flex size-full items-center justify-center", className)}>
      <FileText className="size-1/3 max-h-10 max-w-10 text-muted-foreground" aria-hidden="true" />
    </span>
  );
}
