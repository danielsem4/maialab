import { Copy, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { deleteSelection, duplicateSelection } from "../editorCommands";

export function SelectionActions() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="sm" onClick={duplicateSelection} className="flex-1">
        <Copy className="size-4" />
        {t("decks.inspector.duplicate")}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={deleteSelection}
        className="flex-1 text-destructive hover:text-destructive"
      >
        <Trash2 className="size-4" />
        {t("decks.inspector.delete")}
      </Button>
    </div>
  );
}
