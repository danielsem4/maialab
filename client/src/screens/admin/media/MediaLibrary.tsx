import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { Button } from "@/components/ui/button";
import { MediaDetailsDialog } from "./components/MediaDetailsDialog";
import { MediaDropZone } from "./components/MediaDropZone";
import { MediaTile } from "./components/MediaTile";
import { MEDIA_LIBRARY_ACCEPT, useMediaLibraryScreen } from "./hooks/useMediaLibraryScreen";

export default function MediaLibrary() {
  const { t } = useTranslation();
  const {
    items,
    selected,
    isLoading,
    isError,
    inputRef,
    isUploading,
    openFilePicker,
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleSelect,
    handleCloseDetails,
    handleRetry,
  } = useMediaLibraryScreen();

  return (
    <div>
      <AdminPageHeader
        title={t("nav.media")}
        actions={
          <Button onClick={openFilePicker} disabled={isUploading}>
            <Upload className="size-4" />
            {isUploading ? t("media.uploading") : t("media.upload")}
          </Button>
        }
      />
      <input ref={inputRef} type="file" accept={MEDIA_LIBRARY_ACCEPT} hidden onChange={handleInputChange} />
      <MediaDropZone
        isUploading={isUploading}
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={handleRetry}
        isEmpty={items.length === 0}
        empty={t("media.empty")}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {items.map((media) => (
            <MediaTile key={media.id} media={media} onSelect={handleSelect} />
          ))}
        </div>
      </QueryState>
      <MediaDetailsDialog media={selected} onClose={handleCloseDetails} />
    </div>
  );
}
