import type { IPoint } from "@/common/utils/geometry";
import { MIN_ELEMENT_SIZE, SLIDE_HEIGHT, SLIDE_WIDTH } from "./deckDoc";

export interface IBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Snap lines for the slide's edges and centre. */
export const STAGE_GUIDELINES = { vertical: [0, 960, 1920], horizontal: [0, 540, 1080] } as const;

const MIN_SCALE = 0.05;

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Enforces the minimum size and keeps at least MIN_ELEMENT_SIZE px of the element on the slide on each axis. */
export function clampElement(box: IBox): IBox {
  const w = Math.max(MIN_ELEMENT_SIZE, Number.isFinite(box.w) ? box.w : 0);
  const h = Math.max(MIN_ELEMENT_SIZE, Number.isFinite(box.h) ? box.h : 0);
  return {
    x: clamp(box.x, MIN_ELEMENT_SIZE - w, SLIDE_WIDTH - MIN_ELEMENT_SIZE),
    y: clamp(box.y, MIN_ELEMENT_SIZE - h, SLIDE_HEIGHT - MIN_ELEMENT_SIZE),
    w,
    h,
  };
}

export function centeredBox(w: number, h: number, center?: IPoint): IBox {
  const c = center ?? { x: SLIDE_WIDTH / 2, y: SLIDE_HEIGHT / 2 };
  return clampElement({ x: c.x - w / 2, y: c.y - h / 2, w, h });
}

/** Scale that fits the whole slide into a container, leaving `padding` px free on every side. */
export function containScale(containerW: number, containerH: number, padding = 0): number {
  const scale = Math.min((containerW - padding * 2) / SLIDE_WIDTH, (containerH - padding * 2) / SLIDE_HEIGHT);
  return Number.isFinite(scale) ? Math.max(MIN_SCALE, scale) : MIN_SCALE;
}
