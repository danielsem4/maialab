import type { IRect } from "@/common/utils/geometry";

/**
 * Pixel layout of a placement task inside the iPad frame (1024 wide, ~520 tall under the instruction).
 * Everything is expressed for LTR; `useBoardLayout` mirrors it for RTL languages.
 */
export const AREA_WIDTH = 1024;
const PAD = 24;
const GAP = 20;

/** The board (room or diary) sits at the start side. Components lay their targets out in these local px. */
export const BOARD_SIZE = { width: 660, height: 500 };
export const BOARD: IRect = { x: PAD, y: 0, ...BOARD_SIZE };

/** The tray column takes the rest of the width at the end side. */
export const TRAY: IRect = {
  x: BOARD.x + BOARD.width + GAP,
  y: 0,
  width: AREA_WIDTH - PAD - (BOARD.x + BOARD.width + GAP),
  height: BOARD.height,
};

/** Draggable item cards: fixed size, stacked under the tray heading. */
export const ITEM_SIZE = { width: 200, height: 60 };
/** A card shrinks once it sits in a spot, so it fits inside the spot without covering its neighbours. */
export const PLACED_ITEM_SIZE = { width: 136, height: 56 };
export const TRAY_HEADING_HEIGHT = 44;
export const ITEM_STEP = ITEM_SIZE.height + 6;
