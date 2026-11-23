import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { IMedia } from "@/common/types/Media";
import { getMediaKind } from "@/common/utils/mediaKind";
import { useUploadMedia, useUploadVideo } from "@/hooks/queries/useMediaQueries";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // videos take a separate, direct-to-storage route
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const PDF_ACCEPT = "application/pdf";
export const VIDEO_ACCEPT = "video/mp4,video/webm";

/** Frame size of a video file, read from its metadata in the browser (null when it cannot be read). */
function readVideoSize(file: File): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    const finish = (width: number | null, height: number | null) => {
      URL.revokeObjectURL(url);
      resolve({ width, height });
    };
    video.preload = "metadata";
    video.onloadedmetadata = () => finish(video.videoWidth || null, video.videoHeight || null);
    video.onerror = () => finish(null, null);
    video.src = url;
  });
}

/** Hidden file input + upload mutation, with client-side size/type checks. Videos also report progress. */
export function useFileUpload(accept: string, onUploaded: (media: IMedia) => void) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia();
  const uploadVideo = useUploadVideo();
  const [progress, setProgress] = useState<number | null>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const uploadVideoFile = async (file: File) => {
    if (file.size > MAX_VIDEO_BYTES) {
      toast.error(t("media.videoTooLarge"));
      return;
    }
    setProgress(0);
    const size = await readVideoSize(file);
    uploadVideo.mutate(
      { file, ...size, onProgress: setProgress },
      { onSuccess: onUploaded, onSettled: () => setProgress(null) },
    );
  };

  const uploadFile = (file: File) => {
    if (!accept.split(",").includes(file.type)) {
      toast.error(t(accept === VIDEO_ACCEPT ? "media.unsupportedVideo" : "media.unsupported"));
      return;
    }
    if (getMediaKind(file.type) === "video") {
      void uploadVideoFile(file);
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
    isUploading: upload.isPending || progress !== null,
    /** 0-100 while a video is uploading, otherwise null. */
    progress,
    openFilePicker,
    handleInputChange,
    handleDrop,
    handleDragOver,
  };
}
