import type { IPoint } from "@/common/utils/geometry";
import { CARD_SIZE, PIECE_IDS, PIECES } from "./housePieces";
import { ShapeIcon } from "../../components/ShapeIcon";

interface HousePictureProps {
  origin: IPoint;
  label: string;
}

/** The model card: a complete house drawing to copy. */
export function HousePicture({ origin, label }: HousePictureProps) {
  return (
    <div
      className="absolute rounded-2xl border-2 bg-card shadow-sm"
      style={{ left: origin.x, top: origin.y, width: CARD_SIZE.width, height: CARD_SIZE.height }}
    >
      <span className="absolute start-4 top-3 text-base font-medium text-muted-foreground">{label}</span>
      {PIECE_IDS.map((id) => {
        const piece = PIECES[id];
        return (
          <div
            key={id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: piece.cardCenter.x, top: piece.cardCenter.y, width: piece.width, height: piece.height }}
          >
            <ShapeIcon kind={piece.kind} shapeClassName={piece.fillClassName} />
          </div>
        );
      })}
    </div>
  );
}
