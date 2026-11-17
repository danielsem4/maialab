export interface IPoint {
  x: number;
  y: number;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Converts a pointer position on screen to coordinates inside an element, in the element's own
 * (unscaled) pixels. Demos render inside a CSS-scaled device frame, so the on-screen rect is smaller
 * than the element's layout width and the offset has to be divided by that ratio.
 */
export function toLocalPoint(clientX: number, clientY: number, rect: IRect, layoutWidth: number): IPoint {
  const scale = layoutWidth > 0 && rect.width > 0 ? rect.width / layoutWidth : 1;
  return { x: (clientX - rect.x) / scale, y: (clientY - rect.y) / scale };
}

export function distance(a: IPoint, b: IPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function isInsideRect(point: IPoint, rect: IRect): boolean {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

/** SVG path data for a freehand stroke: "M x y L x y ...". */
export function pointsToPath(points: IPoint[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${Math.round(p.x)} ${Math.round(p.y)}`).join(" ");
}
