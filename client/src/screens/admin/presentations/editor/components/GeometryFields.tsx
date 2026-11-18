import { useTranslation } from "react-i18next";
import type { IDeckElement } from "@/common/types/Deck";
import { NumberField } from "@/components/deck/fields/NumberField";
import type { IFrame } from "@/lib/deck/stageGeometry";
import { commitFrames } from "../editorCommands";

interface GeometryFieldsProps {
  element: IDeckElement;
}

const FIELDS: { key: keyof IFrame; labelKey: string }[] = [
  { key: "x", labelKey: "decks.inspector.x" },
  { key: "y", labelKey: "decks.inspector.y" },
  { key: "w", labelKey: "decks.inspector.width" },
  { key: "h", labelKey: "decks.inspector.height" },
  { key: "rotation", labelKey: "decks.inspector.rotation" },
];

export function GeometryFields({ element }: GeometryFieldsProps) {
  const { t } = useTranslation();
  const { x, y, w, h, rotation } = element;
  const frame: IFrame = { x, y, w, h, rotation };

  // commitFrames clamps, so typed values obey the same limits as dragging.
  const handleChange = (key: keyof IFrame) => (value: number) => {
    commitFrames(new Map([[element.id, { ...frame, [key]: value }]]));
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {FIELDS.map((field) => (
        <NumberField
          key={field.key}
          id={`geometry-${field.key}`}
          label={t(field.labelKey)}
          value={frame[field.key]}
          onChange={handleChange(field.key)}
        />
      ))}
    </div>
  );
}
