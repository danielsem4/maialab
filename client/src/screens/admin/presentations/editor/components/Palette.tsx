import { useTranslation } from "react-i18next";
import { elementRegistry, paletteOrder } from "@/components/deck/elements/registry";
import { PaletteItem } from "./PaletteItem";

interface PaletteProps {
  onAdd: (type: string) => void;
}

export function Palette({ onAdd }: PaletteProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 border-b px-3 py-2" role="toolbar" aria-label={t("decks.palette.title")}>
      <span className="text-sm text-muted-foreground">{t("decks.palette.title")}</span>
      {paletteOrder.map((type) => (
        <PaletteItem key={type} definition={elementRegistry[type]} onAdd={onAdd} />
      ))}
    </div>
  );
}
