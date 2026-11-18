import { useTranslation } from "react-i18next";
import type { ITextProps } from "@/common/types/Deck";
import { NumberField } from "../../fields/NumberField";
import { OptionField } from "../../fields/OptionField";
import type { IElementInspectorProps } from "../types";

const DIRECTIONS: { value: ITextProps["dir"]; labelKey: string }[] = [
  { value: "auto", labelKey: "decks.text.dirAuto" },
  { value: "ltr", labelKey: "decks.text.dirLtr" },
  { value: "rtl", labelKey: "decks.text.dirRtl" },
];

const VERTICAL: ITextProps["verticalAlign"][] = ["top", "middle", "bottom"];

export function TextInspector({ element, onChange }: IElementInspectorProps<ITextProps>) {
  const { t } = useTranslation();
  const { props } = element;
  const directionOptions = DIRECTIONS.map(({ value, labelKey }) => ({ value, label: t(labelKey) }));
  const verticalOptions = VERTICAL.map((value) => ({ value, label: t(`decks.text.${value}`) }));

  const handleFontSize = (fontSize: number) => onChange({ fontSize });
  const handleDir = (dir: ITextProps["dir"]) => onChange({ dir });
  const handleVertical = (verticalAlign: ITextProps["verticalAlign"]) => onChange({ verticalAlign });

  return (
    <div className="space-y-3">
      <NumberField
        id="text-font-size"
        label={t("decks.text.fontSize")}
        value={props.fontSize}
        onChange={handleFontSize}
        min={8}
        max={400}
      />
      <OptionField
        id="text-dir"
        label={t("decks.text.direction")}
        value={props.dir}
        options={directionOptions}
        onChange={handleDir}
      />
      <OptionField
        id="text-vertical"
        label={t("decks.text.verticalAlign")}
        value={props.verticalAlign}
        options={verticalOptions}
        onChange={handleVertical}
      />
    </div>
  );
}
