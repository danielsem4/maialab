import { FileText } from "lucide-react";
import type { IMedia } from "@/common/types/Media";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  media: IMedia;
  className?: string;
  /** "cover" crops to fill (grid tiles); "contain" shows the whole image (details). */
  fit?: "cover" | "contain";
}

export function MediaPreview({ media, className, fit = "cover" }: MediaPreviewProps) {
  if (media.mimeType.startsWith("image/")) {
    return (
      <img
        src={media.url}
        alt={media.alt}
        className={cn("size-full", fit === "cover" ? "object-cover" : "object-contain", className)}
      />
    );
  }
  return (
    <span className={cn("flex size-full items-center justify-center", className)}>
      <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
    </span>
  );
}
