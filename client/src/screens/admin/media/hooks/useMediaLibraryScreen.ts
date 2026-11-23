import { useState } from "react";
import type { IMedia } from "@/common/types/Media";
import { IMAGE_ACCEPT, PDF_ACCEPT, VIDEO_ACCEPT, useFileUpload } from "@/hooks/common/useFileUpload";
import { useMediaLibrary } from "@/hooks/queries/useMediaQueries";

export const MEDIA_LIBRARY_ACCEPT = `${IMAGE_ACCEPT},${PDF_ACCEPT},${VIDEO_ACCEPT}`;

const noop = () => {};

export function useMediaLibraryScreen() {
  const query = useMediaLibrary();
  const { inputRef, isUploading, progress, openFilePicker, handleInputChange, handleDrop, handleDragOver } = useFileUpload(
    MEDIA_LIBRARY_ACCEPT,
    noop,
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const items = query.data ?? [];
  const selected = items.find((m) => m.id === selectedId) ?? null;

  const handleSelect = (media: IMedia) => {
    setSelectedId(media.id);
  };

  const handleCloseDetails = () => {
    setSelectedId(null);
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    items,
    selected,
    isLoading: query.isLoading,
    isError: query.isError,
    inputRef,
    isUploading,
    progress,
    openFilePicker,
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleSelect,
    handleCloseDetails,
    handleRetry,
  };
}
