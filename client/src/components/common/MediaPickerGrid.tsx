import { useTranslation } from "react-i18next";
import type { IMedia } from "@/common/types/Media";
import { getMediaKind } from "@/common/utils/mediaKind";
import { MediaThumb } from "./MediaThumb";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaPickerGridProps {
  items: IMedia[];
  isLoading: boolean;
  onSelect: (media: IMedia) => void;
}

interface MediaPickerTileProps {
  media: IMedia;
  onSelect: (media: IMedia) => void;
}

function MediaPickerTile({ media, onSelect }: MediaPickerTileProps) {
  const handleClick = () => {
    onSelect(media);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative aspect-square overflow-hidden rounded-md border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      title={media.originalName}
    >
      <MediaThumb media={media} className="transition group-hover:scale-105" />
      {getMediaKind(media.mimeType) === "file" && (
        <span className="absolute inset-x-0 bottom-0 line-clamp-2 p-2 text-xs break-all">{media.originalName}</span>
      )}
    </button>
  );
}

export function MediaPickerGrid({ items, isLoading, onSelect }: MediaPickerGridProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{t("media.empty")}</p>;
  }

  return (
    <div className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
      {items.map((media) => (
        <MediaPickerTile key={media.id} media={media} onSelect={onSelect} />
      ))}
    </div>
  );
}
