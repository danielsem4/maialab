import { numberPosition, pointOnClock } from "@/common/utils/clockUtils";
import type { IPoint } from "@/common/utils/geometry";

interface ClockFaceProps {
  center: IPoint;
  radius: number;
  showTicks?: boolean;
  showNumbers?: boolean;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);

/** An SVG clock face (rendered inside an <svg>): the dial, optional hour ticks and numbers. */
export function ClockFace({ center, radius, showTicks = false, showNumbers = false }: ClockFaceProps) {
  return (
    <g aria-hidden>
      <circle cx={center.x} cy={center.y} r={radius} className="fill-card stroke-foreground" strokeWidth={6} />
      {showTicks &&
        HOURS.map((hour) => {
          const outer = pointOnClock(center, radius - 10, hour * 30);
          const inner = pointOnClock(center, radius - 28, hour * 30);
          return (
            <line
              key={hour}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              className="stroke-muted-foreground"
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
      {showNumbers &&
        HOURS.map((hour) => {
          const at = numberPosition(center, radius - 55, hour);
          return (
            <text
              key={hour}
              x={at.x}
              y={at.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground text-3xl font-semibold"
            >
              {hour}
            </text>
          );
        })}
      <circle cx={center.x} cy={center.y} r={8} className="fill-foreground" />
    </g>
  );
}
