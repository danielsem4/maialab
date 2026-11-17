import { useTranslation } from "react-i18next";
import {
  handsMatchTime,
  type IClockTime,
  type IHandAngles,
} from "@/common/utils/clockUtils";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { useClockHands } from "../hooks/useClockHands";
import { ClockFace } from "./ClockFace";
import { ClockHand } from "./ClockHand";

const CENTER = { x: 380, y: 290 };
const RADIUS = 245;

interface SetHandsClockProps {
  instruction: string;
  initial: IHandAngles;
  target: IClockTime;
  onComplete: (passed: boolean) => void;
}

/** A clock whose hands the patient drags into place, then confirms with "Done". Shared by tasks 3 and 4. */
export function SetHandsClock({
  instruction,
  initial,
  target,
  onComplete,
}: SetHandsClockProps) {
  const { t } = useTranslation();
  const { svgRef, hands, activeHand, handlersFor } = useClockHands(
    CENTER,
    initial,
  );

  function handleDone() {
    onComplete(handsMatchTime(hands, target));
  }

  return (
    <TaskLayout instruction={instruction}>
      <div className="flex size-full items-center">
        <svg ref={svgRef} className="h-full w-[720px] shrink-0">
          <ClockFace center={CENTER} radius={RADIUS} showTicks showNumbers />
          <ClockHand
            {...handlersFor("hour")}
            center={CENTER}
            angle={hands.hourAngle}
            length={RADIUS * 0.5}
            width={14}
            label={t("demos.clock.hourHand")}
            active={activeHand === "hour"}
            className="stroke-foreground text-foreground"
          />
          <ClockHand
            {...handlersFor("minute")}
            center={CENTER}
            angle={hands.minuteAngle}
            length={RADIUS * 0.78}
            width={8}
            label={t("demos.clock.minuteHand")}
            active={activeHand === "minute"}
            className="stroke-primary text-primary"
          />
        </svg>
        <div className="flex w-64 flex-col gap-4 pe-8 text-lg text-muted-foreground">
          <p className="flex items-center gap-3">
            <span className="h-3.5 w-12 rounded-full bg-foreground" />
            {t("demos.clock.hourHand")}
          </p>
          <p className="flex items-center gap-3">
            <span className="h-2 w-16 rounded-full bg-primary" />
            {t("demos.clock.minuteHand")}
          </p>
          <Button size="lg" className="mt-6 h-16 text-xl" onClick={handleDone}>
            {t("demos.clock.done")}
          </Button>
        </div>
      </div>
    </TaskLayout>
  );
}
