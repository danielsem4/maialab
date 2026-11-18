import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

function handleReload() {
  window.location.reload();
}

/** Shown, without a way to dismiss it, once a save was refused because the deck changed elsewhere. */
export function ConflictAlert() {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 border-b border-destructive/40 bg-destructive/10 px-4 py-3 text-sm"
    >
      <AlertTriangle className="size-5 shrink-0 text-destructive" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{t("decks.editor.conflictTitle")}</p>
        <p className="text-muted-foreground">{t("decks.editor.conflictBody")}</p>
      </div>
      <Button type="button" size="sm" onClick={handleReload}>
        {t("decks.editor.reload")}
      </Button>
    </div>
  );
}
