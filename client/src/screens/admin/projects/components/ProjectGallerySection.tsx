import { Upload } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormSection } from "@/components/common/FormSection";
import { MediaPicker } from "@/components/common/MediaPicker";
import { SortableList } from "@/components/common/SortableList";
import { Button } from "@/components/ui/button";
import { IMAGE_ACCEPT, useFileUpload } from "@/hooks/common/useFileUpload";
import { useGalleryEditor } from "../hooks/useGalleryEditor";
import type { ProjectFormValues } from "../schema/projectFormSchema";
import { AddVideoButton } from "./AddVideoButton";
import { GalleryRow } from "./GalleryRow";

const GALLERY_MEDIA = ["image/", "video/"];

interface ProjectGallerySectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectGallerySection({ form }: ProjectGallerySectionProps) {
  const { t } = useTranslation();
  const gallery = useGalleryEditor(form);
  const { inputRef, isUploading, openFilePicker, handleInputChange } = useFileUpload(IMAGE_ACCEPT, gallery.handleAdd);

  const getKey = (field: (typeof gallery.fields)[number]) => field.key;

  const renderRow = (field: (typeof gallery.fields)[number], index: number) => (
    <GalleryRow index={index} media={field.media} register={form.register} onRemove={gallery.handleRemove} />
  );

  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={isUploading}>
        <Upload className="size-4" />
        {isUploading ? t("media.uploading") : t("projects.addImage")}
      </Button>
      <AddVideoButton onUploaded={gallery.handleAdd} />
      <MediaPicker onSelect={gallery.handleAdd} mimePrefixes={GALLERY_MEDIA} />
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPT} hidden onChange={handleInputChange} />
    </div>
  );

  return (
    <FormSection title={t("projects.gallery")} actions={actions}>
      {gallery.fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("projects.galleryEmpty")}</p>
      ) : (
        <SortableList items={gallery.fields} getId={getKey} onReorder={gallery.handleReorder} renderItem={renderRow} />
      )}
    </FormSection>
  );
}
