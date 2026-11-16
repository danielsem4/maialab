import { useTranslation } from "react-i18next";
import type { IMedia } from "@/common/types/Media";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { FormField } from "@/components/common/FormField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaDetails } from "../hooks/useMediaDetails";
import { MediaPreview } from "./MediaPreview";
import { toKilobytes } from "./mediaSize";

interface MediaDetailsDialogProps {
  media: IMedia | null;
  onClose: () => void;
}

function MediaDetailsBody({ media, onClose }: { media: IMedia; onClose: () => void }) {
  const { t } = useTranslation();
  const details = useMediaDetails(media, onClose);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="truncate" dir="auto">
          {media.originalName}
        </DialogTitle>
        <DialogDescription>{t("media.size", { size: toKilobytes(media.size) })}</DialogDescription>
      </DialogHeader>
      <div className="aspect-video overflow-hidden rounded-md border bg-muted">
        <MediaPreview media={media} fit="contain" />
      </div>
      <FormField id="media-alt" label={t("media.alt")}>
        <Textarea id="media-alt" rows={2} dir="auto" value={details.alt} onChange={details.handleAltChange} />
      </FormField>
      <DialogFooter className="sm:justify-between">
        <ConfirmDeleteButton
          name={media.originalName}
          onConfirm={details.handleDelete}
          disabled={details.isDeleting}
          withLabel
        />
        <LoadingButton
          type="button"
          onClick={details.handleSaveAlt}
          loading={details.isSaving}
          loadingText={t("common.saving")}
          disabled={!details.isAltDirty}
        >
          {t("common.save")}
        </LoadingButton>
      </DialogFooter>
    </>
  );
}

export function MediaDetailsDialog({ media, onClose }: MediaDetailsDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={media !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {media && <MediaDetailsBody key={media.id} media={media} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
