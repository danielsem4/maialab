import { describe, expect, it } from "vitest";
import {
  addMinutes,
  angleFromCenter,
  angleToMinute,
  handsMatchTime,
  hourToAngle,
  isRoughCircle,
  minuteToAngle,
  normalizeAngle,
  numberPosition,
  pointOnClock,
  timeToHands,
} from "./clockUtils";

const CENTER = { x: 100, y: 100 };

function circlePoints(radius: number, fromDeg = 0, toDeg = 360, steps = 72) {
  return Array.from({ length: steps + 1 }, (_, i) => pointOnClock(CENTER, radius, fromDeg + ((toDeg - fromDeg) * i) / steps));
}

describe("normalizeAngle", () => {
  it("wraps into [0, 360)", () => {
    expect(normalizeAngle(370)).toBe(10);
    expect(normalizeAngle(-30)).toBe(330);
    expect(normalizeAngle(360)).toBe(0);
  });
});

describe("angleFromCenter", () => {
  it("measures clockwise from 12 o'clock", () => {
    expect(angleFromCenter(CENTER, { x: 100, y: 0 })).toBe(0);
    expect(angleFromCenter(CENTER, { x: 200, y: 100 })).toBe(90);
    expect(angleFromCenter(CENTER, { x: 100, y: 200 })).toBe(180);
    expect(angleFromCenter(CENTER, { x: 0, y: 100 })).toBe(270);
  });
});

describe("pointOnClock / numberPosition", () => {
  it("places points around the center", () => {
    const three = numberPosition(CENTER, 50, 3);
    expect(three.x).toBeCloseTo(150);
    expect(three.y).toBeCloseTo(100);
    const twelve = numberPosition(CENTER, 50, 12);
    expect(twelve.x).toBeCloseTo(100);
    expect(twelve.y).toBeCloseTo(50);
  });

  it("round-trips with angleFromCenter", () => {
    expect(angleFromCenter(CENTER, pointOnClock(CENTER, 40, 135))).toBeCloseTo(135);
  });
});

describe("minute and hour angles", () => {
  it("converts minutes to angles and back", () => {
    expect(minuteToAngle(15)).toBe(90);
    expect(angleToMinute(92)).toBe(15);
    expect(angleToMinute(359)).toBe(0);
  });

  it("moves the hour hand with the minutes", () => {
    expect(hourToAngle(3)).toBe(90);
    expect(hourToAngle(11, 10)).toBe(335);
    expect(hourToAngle(12, 30)).toBe(15);
  });

  it("builds hand angles for a time", () => {
    expect(timeToHands({ hour: 3, minute: 40 })).toEqual({ hourAngle: 110, minuteAngle: 240 });
  });
});

describe("addMinutes", () => {
  it("adds across the hour and wraps past 12", () => {
    expect(addMinutes({ hour: 3, minute: 40 }, 50)).toEqual({ hour: 4, minute: 30 });
    expect(addMinutes({ hour: 12, minute: 50 }, 20)).toEqual({ hour: 1, minute: 10 });
    expect(addMinutes({ hour: 11, minute: 30 }, 30)).toEqual({ hour: 12, minute: 0 });
  });
});

describe("handsMatchTime", () => {
  const target = { hour: 11, minute: 10 };

  it("accepts the exact time and the hour hand pointing at the hour mark", () => {
    expect(handsMatchTime({ hourAngle: 335, minuteAngle: 60 }, target)).toBe(true);
    expect(handsMatchTime({ hourAngle: 330, minuteAngle: 60 }, target)).toBe(true);
  });

  it("allows a small minute tolerance", () => {
    expect(handsMatchTime({ hourAngle: 335, minuteAngle: 72 }, target)).toBe(true);
    expect(handsMatchTime({ hourAngle: 335, minuteAngle: 78 }, target)).toBe(false);
  });

  it("rejects swapped hands and a wrong hour", () => {
    expect(handsMatchTime({ hourAngle: 60, minuteAngle: 330 }, target)).toBe(false);
    expect(handsMatchTime({ hourAngle: 300, minuteAngle: 60 }, target)).toBe(false);
  });

  it("handles minutes near the top of the hour", () => {
    expect(handsMatchTime({ hourAngle: 121, minuteAngle: 354 }, { hour: 4, minute: 0 })).toBe(true);
  });
});

describe("isRoughCircle", () => {
  it("accepts a full circle", () => {
    expect(isRoughCircle(circlePoints(120))).toBe(true);
  });

  it("rejects an open arc, a tiny circle and a straight line", () => {
    expect(isRoughCircle(circlePoints(120, 0, 200))).toBe(false);
    expect(isRoughCircle(circlePoints(20))).toBe(false);
    const line = Array.from({ length: 50 }, (_, i) => ({ x: i * 10, y: 100 }));
    expect(isRoughCircle(line)).toBe(false);
  });

  it("rejects a very flat ellipse", () => {
    const flat = circlePoints(150).map((p) => ({ x: p.x, y: CENTER.y + (p.y - CENTER.y) * 0.3 }));
    expect(isRoughCircle(flat)).toBe(false);
  });

  it("rejects too few points", () => {
    expect(isRoughCircle([{ x: 0, y: 0 }])).toBe(false);
  });
});
