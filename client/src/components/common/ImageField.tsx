import { ImageIcon, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IMedia } from "@/common/types/Media";
import { Button } from "@/components/ui/button";
import { IMAGE_ACCEPT, useFileUpload } from "@/hooks/common/useFileUpload";
import { cn } from "@/lib/utils";
import { MediaPicker } from "./MediaPicker";

interface ImageFieldProps {
  id: string;
  value: IMedia | null;
  onChange: (media: IMedia | null) => void;
  /** Tailwind aspect class for the preview, e.g. "aspect-video". */
  aspectClassName?: string;
}

/** Image slot: drop/upload a new file, pick one from the library, or clear it. */
export function ImageField({ id, value, onChange, aspectClassName = "aspect-video" }: ImageFieldProps) {
  const { t } = useTranslation();
  const { inputRef, isUploading, openFilePicker, handleInputChange, handleDrop, handleDragOver } = useFileUpload(
    IMAGE_ACCEPT,
    onChange,
  );

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <button
        id={id}
        type="button"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        disabled={isUploading}
        className={cn(
          "relative flex w-full max-w-md items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/40 text-sm text-muted-foreground transition hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          aspectClassName,
        )}
      >
        {value ? (
          <img src={value.url} alt={value.alt} className="size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 p-4 text-center">
            <ImageIcon className="size-6" />
            {isUploading ? t("media.uploading") : t("media.dropHere")}
          </span>
        )}
      </button>
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPT} hidden onChange={handleInputChange} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={isUploading}>
          <Upload className="size-4" />
          {value ? t("media.replace") : t("media.uploadImage")}
        </Button>
        <MediaPicker onSelect={onChange} />
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
            <X className="size-4" />
            {t("common.remove")}
          </Button>
        )}
      </div>
    </div>
  );
}
