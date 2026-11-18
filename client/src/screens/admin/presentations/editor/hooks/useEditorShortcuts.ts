import { useEffect } from "react";
import { TEXT_TYPE } from "@/components/deck/elements/registry";
import { isEditableTarget } from "@/lib/deck/isEditableTarget";
import { commandFromKey, type EditorCommand } from "@/lib/deck/shortcuts";
import { selectCurrentSlide, useDeckEditorStore } from "@/store/useDeckEditorStore";
import { runEditorCommand } from "../editorCommands";

const ALWAYS_AVAILABLE: EditorCommand["kind"][] = ["undo", "redo"];

function isInsideDialog(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[role="dialog"], [role="alertdialog"]') !== null;
}

/** Enter on a single selected text element opens it for editing. */
function startEditingSelectedText(): boolean {
  const state = useDeckEditorStore.getState();
  const [id, ...others] = state.selectedIds;
  const element = selectCurrentSlide(state)?.elements.find((el) => el.id === id);
  if (!element || others.length > 0 || element.type !== TEXT_TYPE) return false;
  state.setEditingText(element.id);
  return true;
}

function handleKeyDown(event: KeyboardEvent) {
  // Typing in a field or the text editor must edit text, never delete or nudge the element.
  if (isEditableTarget(event.target) || isInsideDialog(event.target)) return;
  // Same while a text box is open for editing but focus is elsewhere (say, after using the
  // inspector): Backspace must not delete the box the user believes they are typing in.
  if (useDeckEditorStore.getState().editingTextId) return;
  if (event.key === "Enter" && startEditingSelectedText()) return event.preventDefault();
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
