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
  /** Only show files whose MIME type starts with this, e.g. "image/". */
  mimePrefix?: string;
  /** Pass `open` to control the dialog from outside; no trigger button is rendered then. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MediaPicker({ onSelect, mimePrefix = "image/", open: controlledOpen, onOpenChange }: MediaPickerProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const library = useMediaLibrary(open);
  const items = (library.data ?? []).filter((m) => m.mimeType.startsWith(mimePrefix));

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleSelect = (media: IMedia) => {
    onSelect(media);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <Images className="size-4" />
            {t("media.chooseFromLibrary")}
          </Button>
        </DialogTrigger>
      )}
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
