import { useRef, useState, type PointerEvent } from "react";
import { angleFromCenter, minuteToAngle, angleToMinute, type IHandAngles } from "@/common/utils/clockUtils";
import type { IPoint } from "@/common/utils/geometry";
import { localPointer } from "../../hooks/useDraggables";

export type ClockHand = "hour" | "minute";

/**
 * Two clock hands that rotate around `center` while dragged. The minute hand snaps to whole minutes;
 * the hour hand moves freely. Angles are degrees clockwise from 12.
 */
export function useClockHands(center: IPoint, initial: IHandAngles) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hands, setHands] = useState(initial);
  const [activeHand, setActiveHand] = useState<ClockHand | null>(null);

  function angleAt(event: PointerEvent): number | null {
    return svgRef.current ? angleFromCenter(center, localPointer(event, svgRef.current)) : null;
  }

  function rotate(hand: ClockHand, angle: number) {
    setHands((current) =>
      hand === "hour" ? { ...current, hourAngle: angle } : { ...current, minuteAngle: minuteToAngle(angleToMinute(angle)) },
    );
  }

  function handlersFor(hand: ClockHand) {
    return {
      onPointerDown(event: PointerEvent<SVGElement>) {
        const angle = angleAt(event);
        if (angle === null) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setActiveHand(hand);
        rotate(hand, angle);
      },
      onPointerMove(event: PointerEvent<SVGElement>) {
        const angle = angleAt(event);
        if (activeHand !== hand || angle === null) return;
        rotate(hand, angle);
      },
      onPointerUp() {
        setActiveHand(null);
      },
      onPointerCancel() {
        setActiveHand(null);
      },
      style: { touchAction: "none" as const },
    };
  }

  return { svgRef, hands, activeHand, handlersFor };
}
