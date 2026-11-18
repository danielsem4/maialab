import { useContext, useEffect, useEffectEvent, useRef, type KeyboardEvent } from "react";
import { useEditor } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import type { IDeckElement, ITextProps } from "@/common/types/Deck";
import { textExtensions } from "@/components/deck/elements/text/textExtensions";
import { emptyTextContent, isEmptyTextContent, plainText } from "@/lib/deck/richText";
import { useDeckEditorStore } from "@/store/useDeckEditorStore";
import { ActiveTextEditorContext } from "../ActiveTextEditorContext";
import { deleteElement, updateElementProps } from "../editorCommands";

/** Clicking these keeps text-edit mode: the inspector with its format bar, and anything it pops up. */
const KEEPS_EDITING = '[data-keep-text-editing], [role="dialog"], [role="listbox"], [data-radix-popper-content-wrapper]';

function isUsableDoc(content: unknown): boolean {
  return typeof content === "object" && content !== null && (content as { type?: unknown }).type === "doc";
}

/**
 * In-place editing of one text element. Typing stays inside Tiptap; the document is updated ONCE,
 * when editing ends (click elsewhere, or Escape), so a whole text edit is a single undo step.
 */
export function useTextEditing(element: IDeckElement<ITextProps>) {
  const { t } = useTranslation();
  const { setEditor } = useContext(ActiveTextEditorContext);
  const boxRef = useRef<HTMLDivElement>(null);
  const stored = element.props.content;
  const placeholder = t("decks.elements.textPlaceholder");

  const editor = useEditor({
    extensions: textExtensions,
    content: isUsableDoc(stored) ? (stored as object) : emptyTextContent(""),
    // A box that still holds the placeholder is replaced by the first key press.
    autofocus: plainText(stored) === placeholder ? "all" : "end",
  });

  const finish = () => {
    const content = editor.getJSON();
    if (isEmptyTextContent(content)) deleteElement(element.id);
    else if (JSON.stringify(content) !== JSON.stringify(stored)) updateElementProps(element.id, { content });
    useDeckEditorStore.getState().setEditingText(null);
  };

  const finishFromOutside = useEffectEvent(finish);

  useEffect(() => {
    setEditor(editor);
    return () => {
      setEditor(null);
    };
  }, [editor, setEditor]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (boxRef.current?.contains(target) || target.closest(KEEPS_EDITING)) return;
      finishFromOutside();
    }
    // Capture phase: the edit is committed before the click does whatever it does (select, undo, navigate).
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    finish();
  };

  return { editor, boxRef, handleKeyDown };
}
