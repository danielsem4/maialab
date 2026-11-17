import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { addMinutes, timeToHands } from "@/common/utils/clockUtils";
import { SetHandsClock } from "../components/SetHandsClock";

const SHOWN = { hour: 3, minute: 40 };
const OFFSET_MINUTES = 50;
const TARGET = addMinutes(SHOWN, OFFSET_MINUTES);

/** Comprehension: read the clock, add minutes in your head, and reset the hands (3:40 → 4:30). */
export function LaterTimeTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  return (
    <SetHandsClock
      instruction={t("demos.clock.tasks.later.instruction", { minutes: OFFSET_MINUTES })}
      initial={timeToHands(SHOWN)}
      target={TARGET}
      onComplete={onComplete}
    />
  );
}
