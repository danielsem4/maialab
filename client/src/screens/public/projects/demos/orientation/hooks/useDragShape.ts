import { useTranslation } from "react-i18next";
import type { IPoint, IRect } from "@/common/utils/geometry";
import { mirrorRectX, mirrorX, shapesInside } from "@/common/utils/orientationUtils";
import type { ShapeKind } from "../../components/ShapeIcon";
import { useDraggables } from "../../hooks/useDraggables";

export const SHAPE_IDS: ShapeKind[] = ["star", "triangle", "asterisk", "circle", "diamond", "square"];
export const SHAPE_SIZE = 110;
const TARGET: ShapeKind = "triangle";

/** The task area is the full iPad width; the square sits on the start side, the shapes on the end side. */
const AREA_WIDTH = 1024;
const SQUARE: IRect = { x: 60, y: 30, width: 410, height: 410 };
const COLUMNS = [690, 870];
const ROWS = [95, 245, 395];

const START_POSITIONS = Object.fromEntries(
  SHAPE_IDS.map((id, i) => [id, { x: COLUMNS[i % COLUMNS.length], y: ROWS[Math.floor(i / COLUMNS.length)] }]),
) as Record<ShapeKind, IPoint>;

function mirrorPositions(positions: Record<ShapeKind, IPoint>): Record<ShapeKind, IPoint> {
  return Object.fromEntries(SHAPE_IDS.map((id) => [id, mirrorX(positions[id], AREA_WIDTH)])) as Record<ShapeKind, IPoint>;
}

/** Drag any of six outlined shapes; "Done" passes only when the triangle alone sits inside the square. */
export function useDragShape(onComplete: (passed: boolean) => void) {
  const { i18n } = useTranslation();
  const rtl = i18n.dir() === "rtl";
  const square = rtl ? mirrorRectX(SQUARE, AREA_WIDTH) : SQUARE;
  const draggables = useDraggables<ShapeKind>(rtl ? mirrorPositions(START_POSITIONS) : START_POSITIONS);

  function handleDone() {
    const inside = shapesInside(draggables.positions, square);
    onComplete(inside.length === 1 && inside[0] === TARGET);
  }

  return { ...draggables, square, handleDone };
}
