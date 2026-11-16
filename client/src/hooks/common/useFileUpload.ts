import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { IMedia } from "@/common/types/Media";
import { useUploadMedia } from "@/hooks/queries/useMediaQueries";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const PDF_ACCEPT = "application/pdf";

/** Hidden file input + upload mutation, with client-side size/type checks. */
export function useFileUpload(accept: string, onUploaded: (media: IMedia) => void) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia();

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const uploadFile = (file: File) => {
    if (!accept.split(",").includes(file.type)) {
      toast.error(t("media.unsupported"));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(t("media.tooLarge"));
      return;
    }
    upload.mutate(file, { onSuccess: onUploaded });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) uploadFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return {
    inputRef,
    isUploading: upload.isPending,
    openFilePicker,
    handleInputChange,
    handleDrop,
    handleDragOver,
  };
}
