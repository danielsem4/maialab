import type { IShapeProps } from "@/common/types/Deck";
import type { IElementRenderProps } from "../types";

const DEFAULT_LINE_WIDTH = 8;

export function ShapeRender({ element }: IElementRenderProps<IShapeProps>) {
  const { shape, fill, stroke, strokeWidth, radius } = element.props;

  if (shape === "line") {
    // A line has no area to fill, so it is drawn with the outline, or with the fill colour when there is none.
    const hasStroke = strokeWidth > 0 && stroke !== "transparent";
    const lineStyle = { stroke: hasStroke ? stroke : fill, strokeWidth: hasStroke ? strokeWidth : DEFAULT_LINE_WIDTH };
    return (
      <svg width="100%" height="100%" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
        <line x1="0" y1="50%" x2="100%" y2="50%" style={lineStyle} />
      </svg>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: fill,
        border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : undefined,
        borderRadius: shape === "ellipse" ? "50%" : radius,
      }}
    />
  );
}
