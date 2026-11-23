import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Images } from "lucide-react";
import type { IMedia } from "@/common/types/Media";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaLibrary } from "@/hooks/queries/useMediaQueries";
import { MediaPickerGrid } from "./MediaPickerGrid";

interface MediaPickerProps {
  onSelect: (media: IMedia) => void;
  /** Only show files whose MIME type starts with one of these, e.g. ["image/", "video/"]. */
  mimePrefixes?: string[];
}

const IMAGES_ONLY = ["image/"];

export function MediaPicker({ onSelect, mimePrefixes = IMAGES_ONLY }: MediaPickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const library = useMediaLibrary(open);
  const items = (library.data ?? []).filter((m) => mimePrefixes.some((prefix) => m.mimeType.startsWith(prefix)));

  const handleSelect = (media: IMedia) => {
    onSelect(media);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Images className="size-4" />
          {t("media.chooseFromLibrary")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("media.chooseFromLibrary")}</DialogTitle>
          <DialogDescription className="sr-only">{t("nav.media")}</DialogDescription>
        </DialogHeader>
        <MediaPickerGrid items={items} isLoading={library.isLoading} onSelect={handleSelect} />
      </DialogContent>
    </Dialog>
  );
}
