import { distance, type IPoint } from "./geometry";

export interface IClockTime {
  hour: number;
  minute: number;
}

/** Angles of the two clock hands, in degrees clockwise from 12. */
export interface IHandAngles {
  hourAngle: number;
  minuteAngle: number;
}

/** Wraps any angle into [0, 360). */
export function normalizeAngle(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/** Direction from `center` to `point` in degrees clockwise from 12 o'clock (screen coordinates, y down). */
export function angleFromCenter(center: IPoint, point: IPoint): number {
  const degrees = (Math.atan2(point.x - center.x, center.y - point.y) * 180) / Math.PI;
  return normalizeAngle(degrees);
}

/** Point at `radius` from `center` in the direction of `angle` (degrees clockwise from 12). */
export function pointOnClock(center: IPoint, radius: number, angle: number): IPoint {
  const radians = (angle * Math.PI) / 180;
  return { x: center.x + radius * Math.sin(radians), y: center.y - radius * Math.cos(radians) };
}

/** Where the number `n` (1–12) sits on a clock face. */
export function numberPosition(center: IPoint, radius: number, n: number): IPoint {
  return pointOnClock(center, radius, (n % 12) * 30);
}

export function minuteToAngle(minute: number): number {
  return normalizeAngle(minute * 6);
}

/** The whole minute a minute hand at `angle` points to (0–59). */
export function angleToMinute(angle: number): number {
  return Math.round(normalizeAngle(angle) / 6) % 60;
}

/** Angle of the hour hand at hour:minute — it moves between the hour marks as the minutes pass. */
export function hourToAngle(hour: number, minute = 0): number {
  return normalizeAngle(((hour % 12) + minute / 60) * 30);
}

/** Hand angles that show a given time, with the minute hand on a whole minute. */
export function timeToHands(time: IClockTime): IHandAngles {
  return { hourAngle: hourToAngle(time.hour, time.minute), minuteAngle: minuteToAngle(time.minute) };
}

/** Adds minutes to a time on a 12-hour clock (hour 1–12). */
export function addMinutes(time: IClockTime, minutes: number): IClockTime {
  const total = (((time.hour % 12) * 60 + time.minute + minutes) % 720 + 720) % 720;
  const hour = Math.floor(total / 60);
  return { hour: hour === 0 ? 12 : hour, minute: total % 60 };
}

/**
 * Whether the hands show `target`: the minute hand within `toleranceMinutes`, and the hour hand inside
 * the sector from the target hour to the next one (plus `slackDegrees`) — as a clinician would accept.
 */
export function handsMatchTime(hands: IHandAngles, target: IClockTime, toleranceMinutes = 2, slackDegrees = 6): boolean {
  const minuteGap = Math.abs(angleToMinute(hands.minuteAngle) - target.minute);
  const minuteOk = Math.min(minuteGap, 60 - minuteGap) <= toleranceMinutes;
  const fromHourMark = normalizeAngle(hands.hourAngle - hourToAngle(target.hour));
  const hourOk = fromHourMark <= 30 + slackDegrees || fromHourMark >= 360 - slackDegrees;
  return minuteOk && hourOk;
}

export interface ICircleOptions {
  minRadius?: number;
  /** Largest allowed standard deviation of the radius, as a fraction of the mean radius. */
  maxSpread?: number;
  /** Number of equal angular sectors that must all contain a point (closes the circle). */
  sectors?: number;
}

/** Whether a freehand drawing (one or more strokes, flattened) is roughly a closed circle. */
export function isRoughCircle(points: IPoint[], { minRadius = 60, maxSpread = 0.2, sectors = 12 }: ICircleOptions = {}): boolean {
  if (points.length < sectors) return false;
  const center = {
    x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
    y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
  };
  const radii = points.map((p) => distance(p, center));
  const mean = radii.reduce((sum, r) => sum + r, 0) / radii.length;
  if (mean < minRadius) return false;
  const spread = Math.sqrt(radii.reduce((sum, r) => sum + (r - mean) ** 2, 0) / radii.length) / mean;
  if (spread > maxSpread) return false;
  const covered = new Set(points.map((p) => Math.floor(angleFromCenter(center, p) / (360 / sectors))));
  return covered.size >= sectors;
}
