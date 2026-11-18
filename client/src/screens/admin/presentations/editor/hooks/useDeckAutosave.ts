import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { decksApi } from "@/api/decksApi";
import { getApiErrorStatus } from "@/common/utils/apiError";
import { queryKeys } from "@/hooks/queries/queryKeys";
import i18n from "@/i18n";
import { createSaveQueue, type ISaveSnapshot, type SaveState } from "@/lib/deck/saveQueue";
import { useDeckEditorStore } from "@/store/useDeckEditorStore";

const AUTOSAVE_DELAY_MS = 1500;
const UNSAVED_STATES: SaveState[] = ["dirty", "saving", "error"];

function handleBeforeUnload(event: BeforeUnloadEvent) {
  event.preventDefault();
}

/**
 * Saves the open deck shortly after every change. Must run after the store has loaded the deck, so
 * the loaded document is the baseline and does not count as a change.
 */
export function useDeckAutosave(deckId: number, initialUpdatedAt: string): SaveState {
  const queryClient = useQueryClient();
  const [saveState, setSaveState] = useState<SaveState>("saved");

  useEffect(() => {
    async function save(snapshot: ISaveSnapshot, updatedAt: string) {
      try {
        return await decksApi.update(deckId, { ...snapshot, updatedAt });
      } catch (error) {
        throw Object.assign(new Error("Deck save failed"), { status: getApiErrorStatus(error) });
      }
    }

    const queue = createSaveQueue({ delayMs: AUTOSAVE_DELAY_MS, initialUpdatedAt, save, onState: setSaveState });
    let last = useDeckEditorStore.getState();

    const unsubscribe = useDeckEditorStore.subscribe((next) => {
      if (!next.doc || next.deckId !== deckId) return;
      if (next.doc === last.doc && next.title === last.title) return;
      last = next;
      queue.schedule({ title: next.title.trim() || i18n.t("decks.editor.untitled"), doc: next.doc });
    });

    return () => {
      unsubscribe();
      void queue.flush().finally(() => {
        queue.dispose();
        void queryClient.invalidateQueries({ queryKey: queryKeys.decks.list() });
      });
    };
  }, [deckId, initialUpdatedAt, queryClient]);

  const hasUnsaved = UNSAVED_STATES.includes(saveState);

  useEffect(() => {
    if (!hasUnsaved) return;
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsaved]);

  return saveState;
}
