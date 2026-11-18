import { useTranslation } from "react-i18next";

interface UnknownElementProps {
  type: string;
}

/** Stand-in for an element type this build does not know. The element itself is left untouched. */
export function UnknownElement({ type }: UnknownElementProps) {
  const { t } = useTranslation();

  return (
    <div className="flex size-full items-center justify-center overflow-hidden border-4 border-dashed border-slate-400 bg-slate-100/70 p-4 text-center text-3xl text-slate-600">
      {t("decks.editor.unknownElement", { type })}
    </div>
  );
}
