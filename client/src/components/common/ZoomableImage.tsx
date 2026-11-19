import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  src: string;
  alt: string;
  /** Classes for the thumbnail image. */
  className?: string;
  /** Classes for the button wrapping the thumbnail (controls how it sits in its container). */
  triggerClassName?: string;
  caption?: string;
  loading?: "lazy" | "eager";
}

/** An image that opens larger in an overlay when clicked. */
export function ZoomableImage({ src, alt, className, triggerClassName, caption, loading }: ZoomableImageProps) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t("common.enlargeImage")}
          className={cn(
            "inline-flex max-w-full cursor-zoom-in items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
            triggerClassName,
          )}
        >
          <img src={src} alt={alt} loading={loading} className={className} />
        </button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="w-auto max-w-[95vw] gap-2 p-2 sm:max-w-[95vw] sm:p-3">
        <DialogTitle className="sr-only">{alt || t("common.imagePreview")}</DialogTitle>
        <img src={src} alt={alt} className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain" />
        {caption && <p className="text-center text-sm text-muted-foreground">{caption}</p>}
      </DialogContent>
    </Dialog>
  );
}
