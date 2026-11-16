import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { IMedia } from "@/common/types/Media";
import type { ProjectFormValues } from "../schema/projectFormSchema";

export function useGalleryEditor(form: UseFormReturn<ProjectFormValues>) {
  const { fields, append, remove, replace } = useFieldArray({ control: form.control, name: "images", keyName: "key" });

  const handleAdd = (media: IMedia) => {
    if (!fields.some((field) => field.media.id === media.id)) append({ media, caption: "" });
  };

  /** Rebuild from current form values so edited captions travel with their image. */
  const handleReorder = (reordered: typeof fields) => {
    const current = form.getValues("images");
    replace(reordered.map((field) => current[fields.indexOf(field)]!));
  };

  return { fields, handleAdd, handleRemove: remove, handleReorder };
}
