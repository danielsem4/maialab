import { useContext } from "react";
import { Link as LinkIcon } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import type { IDeckTheme } from "@/common/types/Deck";
import { ColorField } from "@/components/deck/fields/ColorField";
import { ActiveTextEditorContext } from "../ActiveTextEditorContext";
import { useTextFormatBar } from "../hooks/useTextFormatBar";
import { TEXT_FORMAT_GROUPS, type ITextFormatAction } from "../textFormatActions";
import { TextFormatButton } from "./TextFormatButton";

interface TextFormatBarProps {
  theme: IDeckTheme;
}

interface ActionButtonProps {
  action: ITextFormatAction;
  editor: Editor;
  isActive: boolean;
}

function ActionButton({ action, editor, isActive }: ActionButtonProps) {
  const { t } = useTranslation();

  const handlePress = () => {
    action.run(editor);
  };

  return <TextFormatButton label={t(action.labelKey)} icon={action.icon} isActive={isActive} onPress={handlePress} />;
}

function FormatControls({ editor, theme }: TextFormatBarProps & { editor: Editor }) {
  const { t } = useTranslation();
  const bar = useTextFormatBar(editor);

  return (
    <section className="space-y-2 rounded-md border p-2" aria-label={t("decks.text.format")}>
      {TEXT_FORMAT_GROUPS.map((group) => (
        <div key={group[0].id} className="flex flex-wrap gap-0.5">
          {group.map((action) => (
            <ActionButton key={action.id} action={action} editor={editor} isActive={bar.activeIds.includes(action.id)} />
          ))}
        </div>
      ))}
      <div className="flex flex-wrap gap-0.5">
        <TextFormatButton label={t("decks.text.link")} icon={LinkIcon} isActive={bar.hasLink} onPress={bar.handleLink} />
      </div>
      <ColorField
        id="text-color"
        label={t("decks.text.color")}
        value={bar.color ?? "var(--deck-text)"}
        theme={theme}
        onChange={bar.handleColor}
      />
    </section>
  );
}

/** Formatting for the text box being edited; renders nothing when no text is being edited. */
export function TextFormatBar({ theme }: TextFormatBarProps) {
  const { editor } = useContext(ActiveTextEditorContext);
  if (!editor) return null;
  return <FormatControls editor={editor} theme={theme} />;
}
