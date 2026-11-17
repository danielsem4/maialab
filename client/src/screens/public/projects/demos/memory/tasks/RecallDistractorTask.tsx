import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { isRecallPassed, scoreRecall, type Placements } from "@/common/utils/memoryUtils";
import { RoomPlacementTask } from "../components/RoomPlacementTask";
import { useMemoryPlacements } from "../hooks/useMemoryPlacements";
import { OBJECTS_WITH_DISTRACTORS } from "../memoryData";

const MIN_CORRECT = 3;

/** Put back only the original objects; the two new ones must stay in the tray. */
export function RecallDistractorTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { placements: original } = useMemoryPlacements();

  function handleDone(recalled: Placements) {
    onComplete(isRecallPassed(scoreRecall(original, recalled), MIN_CORRECT));
  }

  return (
    <RoomPlacementTask
      instruction={t("demos.memory.tasks.recall.instruction")}
      items={OBJECTS_WITH_DISTRACTORS}
      onDone={handleDone}
    />
  );
}
