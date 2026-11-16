import { useState } from "react";
import type { IMedia } from "@/common/types/Media";
import { useDeleteMedia, useUpdateMediaAlt } from "@/hooks/queries/useMediaQueries";

export function useMediaDetails(media: IMedia, onClose: () => void) {
  const [alt, setAlt] = useState(media.alt);
  const updateAlt = useUpdateMediaAlt();
  const remove = useDeleteMedia();

  const handleAltChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAlt(event.target.value);
  };

  const handleSaveAlt = () => {
    updateAlt.mutate({ id: media.id, alt: alt.trim() });
  };

  const handleDelete = () => {
    remove.mutate(media.id, { onSuccess: onClose });
  };

  return {
    alt,
    isAltDirty: alt.trim() !== media.alt,
    isSaving: updateAlt.isPending,
    isDeleting: remove.isPending,
    handleAltChange,
    handleSaveAlt,
    handleDelete,
  };
}
