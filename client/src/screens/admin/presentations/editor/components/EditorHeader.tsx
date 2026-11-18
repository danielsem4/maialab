import { ArrowLeft, Redo2, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SaveState } from "@/lib/deck/saveQueue";
import { useEditorHeader } from "../hooks/useEditorHeader";
import { SaveIndicator } from "./SaveIndicator";

interface EditorHeaderProps {
  saveState: SaveState;
}

export function EditorHeader({ saveState }: EditorHeaderProps) {
  const { t } = useTranslation();
  const header = useEditorHeader();

  return (
    <header className="flex items-center gap-2 border-b px-3 py-2">
      <Button asChild variant="ghost" size="icon">
        <Link to="/admin/presentations" aria-label={t("decks.editor.back")}>
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Link>
      </Button>
      <Input
        dir="auto"
        value={header.title}
        onChange={header.handleTitleChange}
        maxLength={200}
        placeholder={t("decks.editor.untitled")}
        aria-label={t("decks.editor.titleLabel")}
        className="h-9 max-w-md min-w-0 flex-1 font-semibold"
      />
      <div className="ms-auto flex items-center gap-1">
        <SaveIndicator state={saveState} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={header.handleUndo}
          disabled={!header.canUndo}
          aria-label={t("decks.editor.undo")}
          title={t("decks.editor.undo")}
        >
          <Undo2 className="size-4 rtl:-scale-x-100" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={header.handleRedo}
          disabled={!header.canRedo}
          aria-label={t("decks.editor.redo")}
          title={t("decks.editor.redo")}
        >
          <Redo2 className="size-4 rtl:-scale-x-100" />
        </Button>
      </div>
    </header>
  );
}
