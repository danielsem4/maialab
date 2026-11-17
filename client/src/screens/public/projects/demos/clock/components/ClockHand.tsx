import type { PointerEvent } from "react";
import { pointOnClock } from "@/common/utils/clockUtils";
import type { IPoint } from "@/common/utils/geometry";
import { cn } from "@/lib/utils";

interface ClockHandProps {
  center: IPoint;
  angle: number;
  length: number;
  width: number;
  label: string;
  active: boolean;
  className: string;
  onPointerDown: (event: PointerEvent<SVGElement>) => void;
  onPointerMove: (event: PointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  style: { touchAction: "none" };
}

/** One draggable clock hand: a visible bar, a knob at its tip, and a wide invisible hit area. */
export function ClockHand({ center, angle, length, width, label, active, className, ...handlers }: ClockHandProps) {
  const tip = pointOnClock(center, length, angle);

  return (
    <g {...handlers} role="slider" aria-label={label} aria-valuenow={Math.round(angle)} className="cursor-grab">
      <line x1={center.x} y1={center.y} x2={tip.x} y2={tip.y} stroke="transparent" strokeWidth={56} strokeLinecap="round" />
      <line
        x1={center.x}
        y1={center.y}
        x2={tip.x}
        y2={tip.y}
        className={className}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <circle cx={tip.x} cy={tip.y} r={active ? 22 : 18} className={cn("fill-current opacity-30", className)} />
    </g>
  );
}
