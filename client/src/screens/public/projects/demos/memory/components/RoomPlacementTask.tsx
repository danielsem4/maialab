import { useTranslation } from "react-i18next";
import type { Placements } from "@/common/utils/memoryUtils";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { useBoardLayout } from "../hooks/useBoardLayout";
import { useDragPlacement } from "../hooks/useDragPlacement";
import type { IMemoryItem } from "../memoryData";
import { ItemTray } from "./ItemTray";
import { ROOM_TARGETS, RoomScene } from "./RoomScene";

interface RoomPlacementTaskProps {
  instruction: string;
  items: IMemoryItem[];
  /** If true, "Done" is enabled only once every item is placed. */
  requireAll?: boolean;
  onDone: (placements: Placements) => void;
}

/** Room at the start side, tray of draggable objects at the end side — shared by the place and recall tasks. */
export function RoomPlacementTask({ instruction, items, requireAll = false, onDone }: RoomPlacementTaskProps) {
  const { t } = useTranslation();
  const layout = useBoardLayout(
    ROOM_TARGETS,
    items.map((item) => item.id),
  );
  const { containerRef, placements, activeId, hoverTargetId, handlersFor, allPlaced } = useDragPlacement(
    layout.trayPositions,
    layout.targets,
  );

  function handleDone() {
    onDone(placements);
  }

  return (
    <TaskLayout instruction={instruction}>
      <div ref={containerRef} className="relative size-full">
        <RoomScene place={layout.place} hoverTargetId={hoverTargetId} />
        <ItemTray items={items} trayRect={layout.trayRect} activeId={activeId} placements={placements} handlersFor={handlersFor}>
          <Button size="lg" className="h-14 text-xl" disabled={requireAll && !allPlaced} onClick={handleDone}>
            {t("demos.memory.done")}
          </Button>
        </ItemTray>
      </div>
    </TaskLayout>
  );
}
