import { FileText, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IMedia } from "@/common/types/Media";
import { MediaPicker } from "@/components/common/MediaPicker";
import { Button } from "@/components/ui/button";
import { PDF_ACCEPT, useFileUpload } from "@/hooks/common/useFileUpload";

const PDF_ONLY = ["application/pdf"];

interface PdfFieldProps {
  id: string;
  value: IMedia | null;
  onChange: (media: IMedia | null) => void;
}

/** PDF slot: upload a file, pick one from the library, or remove it. */
export function PdfField({ id, value, onChange }: PdfFieldProps) {
  const { t } = useTranslation();
  const { inputRef, isUploading, openFilePicker, handleInputChange } = useFileUpload(PDF_ACCEPT, onChange);

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {value && (
        <a
          href={value.url}
          target="_blank"
          rel="noreferrer"
          className="flex max-w-md items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate" dir="auto">
            {value.originalName}
          </span>
        </a>
      )}
      <input ref={inputRef} type="file" accept={PDF_ACCEPT} hidden onChange={handleInputChange} />
      <div className="flex flex-wrap gap-2">
        <Button id={id} type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={isUploading}>
          <Upload className="size-4" />
          {isUploading ? t("media.uploading") : value ? t("media.replace") : t("media.uploadFile")}
        </Button>
        <MediaPicker onSelect={onChange} mimePrefixes={PDF_ONLY} />
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
