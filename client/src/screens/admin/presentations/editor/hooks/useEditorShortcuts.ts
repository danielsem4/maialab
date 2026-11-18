import { useEffect } from "react";
import { isEditableTarget } from "@/lib/deck/isEditableTarget";
import { commandFromKey, type EditorCommand } from "@/lib/deck/shortcuts";
import { useDeckEditorStore } from "@/store/useDeckEditorStore";
import { runEditorCommand } from "../editorCommands";

const ALWAYS_AVAILABLE: EditorCommand["kind"][] = ["undo", "redo"];

function isInsideDialog(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[role="dialog"], [role="alertdialog"]') !== null;
}

function handleKeyDown(event: KeyboardEvent) {
  // Typing in a field or the text editor must edit text, never delete or nudge the element.
  if (isEditableTarget(event.target) || isInsideDialog(event.target)) return;
  const command = commandFromKey(event);
  if (!command) return;
  const hasSelection = useDeckEditorStore.getState().selectedIds.length > 0;
  if (!hasSelection && !ALWAYS_AVAILABLE.includes(command.kind)) return;
  event.preventDefault();
  runEditorCommand(command);
}

/** Keyboard shortcuts for the editor: delete, duplicate, nudge, layer order, undo/redo, deselect. */
export function useEditorShortcuts() {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
