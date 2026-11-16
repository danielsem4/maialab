import { X } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { IMedia } from "@/common/types/Media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectFormValues } from "../schema/projectFormSchema";

interface GalleryRowProps {
  index: number;
  media: IMedia;
  register: UseFormRegister<ProjectFormValues>;
  onRemove: (index: number) => void;
}

export function GalleryRow({ index, media, register, onRemove }: GalleryRowProps) {
  const { t } = useTranslation();

  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <div className="flex items-center gap-3">
      <img src={media.url} alt={media.alt} className="size-16 shrink-0 rounded-md object-cover" />
      <Input
        aria-label={t("projects.caption")}
        placeholder={t("projects.caption")}
        dir="auto"
        {...register(`images.${index}.caption`)}
      />
      <Button type="button" variant="ghost" size="icon" onClick={handleRemove} aria-label={t("common.remove")}>
        <X className="size-4" />
      </Button>
    </div>
  );
}
