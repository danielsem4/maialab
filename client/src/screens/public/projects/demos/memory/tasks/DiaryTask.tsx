import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { checkDiary } from "@/common/utils/memoryUtils";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { DIARY_TARGETS, DiaryGrid } from "../components/DiaryGrid";
import { ItemTray } from "../components/ItemTray";
import { useBoardLayout } from "../hooks/useBoardLayout";
import { useDragPlacement } from "../hooks/useDragPlacement";
import { APPOINTMENTS, DIARY_RULES } from "../memoryData";

const ITEM_IDS = APPOINTMENTS.map((item) => item.id);

/** Drag 3 activities onto a mini calendar under simple rules — the distraction between placing and recall. */
export function DiaryTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const layout = useBoardLayout(DIARY_TARGETS, ITEM_IDS);
  const { containerRef, placements, activeId, hoverTargetId, handlersFor, allPlaced } = useDragPlacement(
    layout.trayPositions,
    layout.targets,
  );

  function handleDone() {
    onComplete(checkDiary(placements, DIARY_RULES));
  }

  return (
    <TaskLayout instruction={t("demos.memory.tasks.diary.instruction")}>
      <div ref={containerRef} className="relative size-full">
        <DiaryGrid place={layout.place} hoverTargetId={hoverTargetId} />
        <ItemTray items={APPOINTMENTS} trayRect={layout.trayRect} activeId={activeId} placements={placements} handlersFor={handlersFor}>
          <Button size="lg" className="h-14 text-xl" disabled={!allPlaced} onClick={handleDone}>
            {t("demos.memory.done")}
          </Button>
        </ItemTray>
      </div>
    </TaskLayout>
  );
}
