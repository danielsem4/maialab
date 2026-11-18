import { useEffect } from "react";
import type { IDeck } from "@/common/types/Deck";
import { useDeckEditorStore } from "@/store/useDeckEditorStore";
import { useDeckAutosave } from "./useDeckAutosave";

/** Puts a loaded deck into the editor store for as long as the editor is mounted, and autosaves it. */
export function useDeckSession(deck: IDeck) {
  const load = useDeckEditorStore((s) => s.load);
  const reset = useDeckEditorStore((s) => s.reset);
  const isLoaded = useDeckEditorStore((s) => s.deckId === deck.id && s.doc !== null);

  // Declared before the autosave effect on purpose: effects run in order, and autosave takes the
  // loaded document as its baseline.
  useEffect(() => {
    load(deck);
    return reset;
  }, [deck, load, reset]);

  const saveState = useDeckAutosave(deck.id, deck.updatedAt);

  return { isLoaded, saveState };
}
