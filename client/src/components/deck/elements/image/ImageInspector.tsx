import { useTranslation } from "react-i18next";
import type { IImageProps } from "@/common/types/Deck";
import type { IMedia } from "@/common/types/Media";
import { MediaPicker } from "@/components/common/MediaPicker";
import { NumberField } from "../../fields/NumberField";
import { OptionField } from "../../fields/OptionField";
import { TextField } from "../../fields/TextField";
import type { IElementInspectorProps } from "../types";

const FITS: IImageProps["fit"][] = ["cover", "contain"];

export function ImageInspector({ element, onChange }: IElementInspectorProps<IImageProps>) {
  const { t } = useTranslation();
  const { props } = element;
  const options = FITS.map((fit) => ({ value: fit, label: t(`decks.inspector.${fit}`) }));

  const handleReplace = (media: IMedia) => onChange({ mediaId: media.id, url: media.url, alt: media.alt });
  const handleFit = (fit: IImageProps["fit"]) => onChange({ fit });
  const handleRadius = (radius: number) => onChange({ radius });
  const handleAlt = (alt: string) => onChange({ alt });

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{t("decks.inspector.replaceImage")}</p>
        <MediaPicker onSelect={handleReplace} />
      </div>
      <OptionField id="image-fit" label={t("decks.inspector.fit")} value={props.fit} options={options} onChange={handleFit} />
      <NumberField
        id="image-radius"
        label={t("decks.inspector.radius")}
        value={props.radius}
        onChange={handleRadius}
        min={0}
        max={1000}
      />
      <TextField id="image-alt" label={t("decks.inspector.alt")} value={props.alt} onChange={handleAlt} maxLength={300} />
    </div>
  );
}
