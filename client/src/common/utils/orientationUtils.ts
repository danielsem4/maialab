import { isInsideRect, type IPoint, type IRect } from "./geometry";

/** Ids of the items whose center lies inside `rect`, in the order of `positions`. */
export function shapesInside<K extends string>(positions: Record<K, IPoint>, rect: IRect): K[] {
  return (Object.keys(positions) as K[]).filter((id) => isInsideRect(positions[id], rect));
}

/** Clamps `value` to [min, max] and rounds it to the nearest multiple of `step` counted from `min`. */
export function snapToStep(value: number, min: number, max: number, step: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  if (step <= 0) return clamped;
  return Math.min(max, min + Math.round((clamped - min) / step) * step);
}

/** Mirrors a point horizontally inside an area of `width` px (for right-to-left layouts). */
export function mirrorX(point: IPoint, width: number): IPoint {
  return { x: width - point.x, y: point.y };
}

/** Mirrors a rectangle horizontally inside an area of `width` px (for right-to-left layouts). */
export function mirrorRectX(rect: IRect, width: number): IRect {
  return { ...rect, x: width - rect.x - rect.width };
}

/** Total number of recorded points across all freehand strokes. */
export function totalPoints(strokes: readonly (readonly IPoint[])[]): number {
  return strokes.reduce((sum, stroke) => sum + stroke.length, 0);
}
