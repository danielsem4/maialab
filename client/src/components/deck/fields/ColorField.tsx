import { useTranslation } from "react-i18next";
import type { IDeckTheme } from "@/common/types/Deck";
import { Label } from "@/components/ui/label";
import { resolveColor, themeColorVar } from "@/lib/deck/colors";
import { ColorSwatch } from "./ColorSwatch";
import { NativeColorInput } from "./NativeColorInput";

/** Checkerboard, the usual way to draw "no colour". */
const NONE_PREVIEW = "repeating-conic-gradient(#cbd5e1 0% 25%, #fff 0% 50%) 50% / 8px 8px";

interface ColorFieldProps {
  id: string;
  label: string;
  value: string | undefined;
  theme: IDeckTheme;
  onChange: (value: string) => void;
  /** Offer a transparent swatch. */
  allowNone?: boolean;
}

/** A custom colour, or a theme colour stored by reference so it follows later theme changes. */
export function ColorField({ id, label, value, theme, onChange, allowNone }: ColorFieldProps) {
  const { t } = useTranslation();
  const resolved = resolveColor(value, theme);

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-wrap items-center gap-1.5">
        <NativeColorInput
          key={resolved}
          id={id}
          value={resolved}
          label={t("decks.inspector.customColor")}
          onCommit={onChange}
        />
        {Object.entries(theme.colors).map(([name, color]) => (
          <ColorSwatch
            key={name}
            value={themeColorVar(name)}
            color={color}
            label={t("decks.inspector.themeColor", { name })}
            isActive={value === themeColorVar(name)}
            onSelect={onChange}
          />
        ))}
        {allowNone && (
          <ColorSwatch
            value="transparent"
            color={NONE_PREVIEW}
            label={t("decks.inspector.noColor")}
            isActive={value === "transparent"}
            onSelect={onChange}
          />
        )}
      </div>
    </div>
  );
}
