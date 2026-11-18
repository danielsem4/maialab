import type { ChangeEvent } from "react";
import { useStore } from "zustand";
import { useDeckEditorStore } from "@/store/useDeckEditorStore";

export function useEditorHeader() {
  const title = useDeckEditorStore((s) => s.title);
  const setTitle = useDeckEditorStore((s) => s.setTitle);
  const canUndo = useStore(useDeckEditorStore.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useStore(useDeckEditorStore.temporal, (s) => s.futureStates.length > 0);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleUndo = () => {
    useDeckEditorStore.temporal.getState().undo();
  };

  const handleRedo = () => {
    useDeckEditorStore.temporal.getState().redo();
  };

  return { title, canUndo, canRedo, handleTitleChange, handleUndo, handleRedo };
}
