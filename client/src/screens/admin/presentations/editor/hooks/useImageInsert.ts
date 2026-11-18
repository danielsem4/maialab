import { useState } from "react";
import type { IMedia } from "@/common/types/Media";
import type { IPoint } from "@/common/utils/geometry";
import { insertImage } from "../editorCommands";

/** An image is created from a media-library file, so adding one first opens the picker. */
export function useImageInsert() {
  const [pending, setPending] = useState<{ center?: IPoint } | null>(null);

  const requestImage = (center?: IPoint) => {
    setPending({ center });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setPending(null);
  };

  const handleSelect = (media: IMedia) => {
    insertImage(media, pending?.center);
    setPending(null);
  };

  return { isPickerOpen: pending !== null, requestImage, handleOpenChange, handleSelect };
}
