import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MediaDropZoneProps {
  isUploading: boolean;
  onClick: () => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
}

export function MediaDropZone({ isUploading, onClick, onDrop, onDragOver }: MediaDropZoneProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      disabled={isUploading}
      className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/40 p-6 text-sm text-muted-foreground transition hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Upload className="size-4" aria-hidden="true" />
      {isUploading ? t("media.uploading") : t("media.dropHere")}
    </button>
  );
}
