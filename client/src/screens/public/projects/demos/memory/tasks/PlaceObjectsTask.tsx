import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import type { Placements } from "@/common/utils/memoryUtils";
import { RoomPlacementTask } from "../components/RoomPlacementTask";
import { useMemoryPlacements } from "../hooks/useMemoryPlacements";
import { OBJECTS } from "../memoryData";

/** Hide 4 objects anywhere in the room. Always passes once all are placed. */
export function PlaceObjectsTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { setPlacements } = useMemoryPlacements();

  // A new run starts here: forget the previous run's placements (matters if this task is skipped).
  useEffect(() => {
    setPlacements({});
  }, [setPlacements]);

  function handleDone(placements: Placements) {
    setPlacements(placements);
    onComplete(true);
  }

  return (
    <RoomPlacementTask
      instruction={t("demos.memory.tasks.place.instruction")}
      items={OBJECTS}
      requireAll
      onDone={handleDone}
    />
  );
}
