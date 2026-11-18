import { useTranslation } from "react-i18next";
import type { IDeck } from "@/common/types/Deck";
import { Spinner } from "@/components/ui/spinner";
import { useDeckSession } from "../hooks/useDeckSession";
import { ConflictAlert } from "./ConflictAlert";
import { EditorHeader } from "./EditorHeader";
import { SlideStrip } from "./SlideStrip";
import { Stage } from "./Stage";

interface DeckWorkspaceProps {
  deck: IDeck;
}

export function DeckWorkspace({ deck }: DeckWorkspaceProps) {
  const { t } = useTranslation();
  const { isLoaded, saveState } = useDeckSession(deck);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center" aria-busy="true" aria-label={t("common.loading.title")}>
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <EditorHeader saveState={saveState} />
      {saveState === "conflict" && <ConflictAlert />}
      <div className="flex min-h-0 flex-1">
        <SlideStrip />
        <Stage />
      </div>
    </div>
  );
}
