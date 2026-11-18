import type { ITextProps } from "@/common/types/Deck";
import { renderTextHtml } from "@/lib/deck/richText";
import type { IElementRenderProps } from "../types";
import { textContainerStyle, textDir } from "./textStyles";
import "./deckText.css";

export function TextRender({ element }: IElementRenderProps<ITextProps>) {
  const { props } = element;

  return (
    <div className="deck-text" dir={textDir(props)} style={textContainerStyle(props)}>
      {/* renderTextHtml only emits known nodes and marks with escaped text. */}
      <div dangerouslySetInnerHTML={{ __html: renderTextHtml(props.content) }} />
    </div>
  );
}
