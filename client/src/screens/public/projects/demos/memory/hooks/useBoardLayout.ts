import { useTranslation } from "react-i18next";
import type { IPoint, IRect } from "@/common/utils/geometry";
import { mirrorRect, offsetRect, type IDropTarget } from "@/common/utils/memoryUtils";
import { AREA_WIDTH, BOARD, BOARD_SIZE, ITEM_SIZE, ITEM_STEP, TRAY, TRAY_HEADING_HEIGHT } from "../memoryLayout";

/**
 * Turns a board's local target rects into drag-container pixels: the board goes to the start side and
 * the tray column to the end side, so in RTL languages the whole layout is mirrored.
 */
export function useBoardLayout(localTargets: IDropTarget[], itemIds: string[]) {
  const { i18n } = useTranslation();
  const rtl = i18n.dir() === "rtl";

  /** Maps a rect in board-local px to the drag container. */
  function place(local: IRect): IRect {
    const rect = offsetRect(local, BOARD.x, BOARD.y);
    return rtl ? mirrorRect(rect, AREA_WIDTH) : rect;
  }

  const trayRect = rtl ? mirrorRect(TRAY, AREA_WIDTH) : TRAY;
  const trayPositions: Record<string, IPoint> = {};
  itemIds.forEach((id, index) => {
    trayPositions[id] = {
      x: trayRect.x + trayRect.width / 2,
      y: trayRect.y + TRAY_HEADING_HEIGHT + ITEM_SIZE.height / 2 + index * ITEM_STEP,
    };
  });

  return {
    board: place({ x: 0, y: 0, ...BOARD_SIZE }),
    place,
    targets: localTargets.map((target) => ({ id: target.id, rect: place(target.rect) })),
    trayRect,
    trayPositions,
  };
}
