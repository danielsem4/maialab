import { useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import { ActiveTextEditorContext } from "../ActiveTextEditorContext";

interface ActiveTextEditorProviderProps {
  children: ReactNode;
}

export function ActiveTextEditorProvider({ children }: ActiveTextEditorProviderProps) {
  const [editor, setEditor] = useState<Editor | null>(null);

  return <ActiveTextEditorContext value={{ editor, setEditor }}>{children}</ActiveTextEditorContext>;
}
