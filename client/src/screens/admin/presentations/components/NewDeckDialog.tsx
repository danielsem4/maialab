import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IDeckSummary } from "@/common/types/Deck";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLANK_TEMPLATE, useNewDeckDialog } from "../hooks/useNewDeckDialog";

interface NewDeckDialogProps {
  templates: IDeckSummary[];
}

export function NewDeckDialog({ templates }: NewDeckDialogProps) {
  const { t } = useTranslation();
  const dialog = useNewDeckDialog();

  return (
    <Dialog open={dialog.open} onOpenChange={dialog.handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          {t("decks.newDeck")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("decks.newDeck")}</DialogTitle>
          <DialogDescription className="sr-only">{t("decks.sectionDesc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={dialog.handleSubmit} className="space-y-4" noValidate>
          <FormField id="deck-title" label={t("decks.titleLabel")} error={dialog.titleError}>
            <Input
              id="deck-title"
              dir="auto"
              autoComplete="off"
              maxLength={200}
              value={dialog.title}
              onChange={dialog.handleTitleChange}
            />
          </FormField>
          <FormField id="deck-template" label={t("decks.startFrom")}>
            <Select value={dialog.templateId} onValueChange={dialog.handleTemplateChange}>
              <SelectTrigger id="deck-template" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BLANK_TEMPLATE}>{t("decks.blank")}</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={String(template.id)}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <DialogFooter>
            <LoadingButton type="submit" loading={dialog.isSubmitting} loadingText={t("common.saving")}>
              {t("common.create")}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
