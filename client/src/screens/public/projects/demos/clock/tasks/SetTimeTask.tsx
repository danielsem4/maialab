import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { timeToHands } from "@/common/utils/clockUtils";
import { SetHandsClock } from "../components/SetHandsClock";

const START = timeToHands({ hour: 8, minute: 0 });
const TARGET = { hour: 11, minute: 10 };

/** The classic drawing-test instruction: set the hands to ten past eleven. */
export function SetTimeTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  return (
    <SetHandsClock
      instruction={t("demos.clock.tasks.hands.instruction")}
      initial={START}
      target={TARGET}
      onComplete={onComplete}
    />
  );
}
