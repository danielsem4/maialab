import type { IPoint, IRect } from "@/common/utils/geometry";
import type { ShapeKind } from "../../components/ShapeIcon";

export type PieceId = "roof" | "body" | "sun";

export interface IHousePiece {
  kind: ShapeKind;
  width: number;
  height: number;
  /** Fill class of the piece — the colour is part of the picture itself. */
  fillClassName: string;
  /** Center inside the model card. */
  cardCenter: IPoint;
  /** Starting center in the tray below the cards. */
  start: IPoint;
}

export const PIECE_IDS: PieceId[] = ["roof", "body", "sun"];

export const PIECES: Record<PieceId, IHousePiece> = {
  roof: { kind: "triangle", width: 180, height: 100, fillClassName: "fill-rose-500", cardCenter: { x: 150, y: 110 }, start: { x: 320, y: 440 } },
  body: { kind: "square", width: 140, height: 140, fillClassName: "fill-sky-500", cardCenter: { x: 150, y: 230 }, start: { x: 520, y: 440 } },
  sun: { kind: "circle", width: 80, height: 80, fillClassName: "fill-amber-400", cardCenter: { x: 290, y: 80 }, start: { x: 700, y: 440 } },
};

/** Both cards: the model on the start side, the blank card to build on at the end side. */
export const CARD_SIZE = { width: 360, height: 330 };
export const MODEL_CARD_ORIGIN: IPoint = { x: 40, y: 20 };
export const TARGET_CARD_ORIGIN: IPoint = { x: 560, y: 20 };
export const TARGET_CARD_RECT: IRect = { ...TARGET_CARD_ORIGIN, ...CARD_SIZE };

/** How far (px) a piece may stray from its model-relative position and still count as a match. */
export const ARRANGEMENT_TOLERANCE = 45;

function mapPieces(pick: (piece: IHousePiece) => IPoint): Record<PieceId, IPoint> {
  return { roof: pick(PIECES.roof), body: pick(PIECES.body), sun: pick(PIECES.sun) };
}

export const START_POSITIONS = mapPieces((p) => p.start);
/** Piece centers of the model, relative to its card — the arrangement to reproduce. */
export const MODEL_POSITIONS = mapPieces((p) => p.cardCenter);
