import { EditorContent } from "@tiptap/react";
import type { IDeckElement, ITextProps } from "@/common/types/Deck";
import { textContainerStyle, textDir } from "@/components/deck/elements/text/textStyles";
import { useTextEditing } from "../hooks/useTextEditing";
import "@/components/deck/elements/text/deckText.css";

interface TextEditorBoxProps {
  element: IDeckElement<ITextProps>;
}

/** Replaces a text element's static render while it is being edited; same container, same styles. */
export function TextEditorBox({ element }: TextEditorBoxProps) {
  const { editor, boxRef, handleKeyDown } = useTextEditing(element);

  return (
    <div
      ref={boxRef}
      className="deck-text cursor-text outline-2 outline-offset-2 outline-sky-500 outline-dashed"
      dir={textDir(element.props)}
      style={textContainerStyle(element.props)}
      onKeyDown={handleKeyDown}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
