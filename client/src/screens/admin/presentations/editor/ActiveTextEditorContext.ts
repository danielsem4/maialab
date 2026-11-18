import { createContext } from "react";
import type { Editor } from "@tiptap/react";

interface IActiveTextEditor {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

/** The Tiptap editor of the text box being edited, so the format bar in the inspector can drive it. */
export const ActiveTextEditorContext = createContext<IActiveTextEditor>({ editor: null, setEditor: () => {} });
