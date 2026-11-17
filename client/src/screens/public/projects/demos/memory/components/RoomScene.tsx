import { useTranslation } from "react-i18next";
import type { IRect } from "@/common/utils/geometry";
import { rectStyle, type IDropTarget } from "@/common/utils/memoryUtils";
import { cn } from "@/lib/utils";
import { ROOM_SPOTS, type IRoomSpot } from "../memoryData";
import { BOARD_SIZE } from "../memoryLayout";

const SPOT_SIZE = { width: 150, height: 124 };

/** A spot's drop rect in room-local px, centered on its percentage position. */
function spotRect(spot: IRoomSpot): IRect {
  return {
    x: (spot.x / 100) * BOARD_SIZE.width - SPOT_SIZE.width / 2,
    y: (spot.y / 100) * BOARD_SIZE.height - SPOT_SIZE.height / 2,
    ...SPOT_SIZE,
  };
}

/** The room's drop targets in room-local px; map them with `place` from `useBoardLayout`. */
export const ROOM_TARGETS: IDropTarget[] = ROOM_SPOTS.map((spot) => ({ id: spot.id, rect: spotRect(spot) }));

interface RoomSceneProps {
  /** Maps room-local rects to the drag container (handles the start-side offset and RTL). */
  place: (local: IRect) => IRect;
  hoverTargetId: string | null;
}

/** A simple illustrated room (wall + floor) with 8 labelled places, each a drop target for one object. */
export function RoomScene({ place, hoverTargetId }: RoomSceneProps) {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="absolute overflow-hidden rounded-2xl border bg-card"
        style={rectStyle(place({ x: 0, y: 0, ...BOARD_SIZE }))}
        aria-hidden
      >
        <div className="absolute inset-x-0 bottom-0 h-[45%] border-t-4 border-primary/30 bg-muted" />
      </div>
      {ROOM_SPOTS.map((spot) => (
        <div
          key={spot.id}
          aria-label={t(spot.labelKey)}
          className={cn(
            "absolute flex flex-col items-center justify-between rounded-xl border-2 border-dashed border-border py-2 text-muted-foreground transition-colors",
            hoverTargetId === spot.id && "border-primary bg-primary/10 text-foreground",
          )}
          style={rectStyle(place(spotRect(spot)))}
        >
          <span className="text-2xl leading-none" aria-hidden>
            {spot.emoji}
          </span>
          <span className="text-base leading-none font-medium">{t(spot.labelKey)}</span>
        </div>
      ))}
    </>
  );
}
