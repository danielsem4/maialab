import { Video } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IMedia } from "@/common/types/Media";
import { Button } from "@/components/ui/button";
import { VIDEO_ACCEPT, useFileUpload } from "@/hooks/common/useFileUpload";

interface AddVideoButtonProps {
  onUploaded: (media: IMedia) => void;
}

/** Picks a video file and uploads it, showing the percentage while it goes up. */
export function AddVideoButton({ onUploaded }: AddVideoButtonProps) {
  const { t } = useTranslation();
  const { inputRef, isUploading, progress, openFilePicker, handleInputChange } = useFileUpload(VIDEO_ACCEPT, onUploaded);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={isUploading}>
        <Video className="size-4" />
        {progress === null ? t("projects.addVideo") : t("media.uploadingPercent", { percent: progress })}
      </Button>
      <input ref={inputRef} type="file" accept={VIDEO_ACCEPT} hidden onChange={handleInputChange} />
    </>
  );
}
