import { useTranslation } from "react-i18next";
import type { IShapeProps } from "@/common/types/Deck";
import { ColorField } from "../../fields/ColorField";
import { NumberField } from "../../fields/NumberField";
import { OptionField } from "../../fields/OptionField";
import type { IElementInspectorProps } from "../types";

const SHAPES: IShapeProps["shape"][] = ["rect", "ellipse", "line"];

export function ShapeInspector({ element, theme, onChange }: IElementInspectorProps<IShapeProps>) {
  const { t } = useTranslation();
  const { props } = element;
  const options = SHAPES.map((shape) => ({ value: shape, label: t(`decks.inspector.${shape}`) }));

  const handleShape = (shape: IShapeProps["shape"]) => onChange({ shape });
  const handleFill = (fill: string) => onChange({ fill });
  const handleStroke = (stroke: string) => onChange({ stroke });
  const handleStrokeWidth = (strokeWidth: number) => onChange({ strokeWidth });
  const handleRadius = (radius: number) => onChange({ radius });

  return (
    <div className="space-y-3">
      <OptionField
        id="shape-kind"
        label={t("decks.inspector.shapeKind")}
        value={props.shape}
        options={options}
        onChange={handleShape}
      />
      <ColorField
        id="shape-fill"
        label={t("decks.inspector.fill")}
        value={props.fill}
        theme={theme}
        onChange={handleFill}
        allowNone
      />
      <ColorField
        id="shape-stroke"
        label={t("decks.inspector.stroke")}
        value={props.stroke}
        theme={theme}
        onChange={handleStroke}
        allowNone
      />
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          id="shape-stroke-width"
          label={t("decks.inspector.strokeWidth")}
          value={props.strokeWidth}
          onChange={handleStrokeWidth}
          min={0}
          max={200}
        />
        {props.shape === "rect" && (
          <NumberField
            id="shape-radius"
            label={t("decks.inspector.radius")}
            value={props.radius}
            onChange={handleRadius}
            min={0}
            max={1000}
          />
        )}
      </div>
    </div>
  );
}
