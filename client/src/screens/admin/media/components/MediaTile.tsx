import { useTranslation } from "react-i18next";
import type { IMedia } from "@/common/types/Media";
import { MediaPreview } from "./MediaPreview";
import { toKilobytes } from "./mediaSize";

interface MediaTileProps {
  media: IMedia;
  onSelect: (media: IMedia) => void;
}

export function MediaTile({ media, onSelect }: MediaTileProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    onSelect(media);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card text-start transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="block aspect-square overflow-hidden bg-muted">
        <MediaPreview media={media} />
      </span>
      <span className="block min-w-0 p-2">
        <span className="block truncate text-sm" dir="auto" title={media.originalName}>
          {media.originalName}
        </span>
        <span className="block text-xs text-muted-foreground">{t("media.size", { size: toKilobytes(media.size) })}</span>
      </span>
    </button>
  );
}
