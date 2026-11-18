import { useEditorState, type Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import { TEXT_FORMAT_GROUPS } from "../textFormatActions";

const ALL_ACTIONS = TEXT_FORMAT_GROUPS.flat();

/** Live state of the text being edited (which formats apply at the cursor) and the colour/link actions. */
export function useTextFormatBar(editor: Editor) {
  const { t } = useTranslation();

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      activeIds: ALL_ACTIONS.filter((action) => action.isActive(current)).map((action) => action.id),
      color: current.getAttributes("textStyle").color as string | undefined,
      href: current.getAttributes("link").href as string | undefined,
    }),
  });

  const handleColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const handleLink = () => {
    const answer = window.prompt(t("decks.text.linkPrompt"), state.href ?? "https://");
    if (answer === null) return;
    const href = answer.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (href) chain.setLink({ href }).run();
    else chain.unsetLink().run();
  };

  return { ...state, hasLink: Boolean(state.href), handleColor, handleLink };
}
