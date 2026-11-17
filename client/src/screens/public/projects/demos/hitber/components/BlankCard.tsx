import type { IPoint } from "@/common/utils/geometry";
import { CARD_SIZE } from "./housePieces";

interface BlankCardProps {
  origin: IPoint;
  label: string;
}

/** The empty card the patient builds the copy on — same size as the model, no guide outlines. */
export function BlankCard({ origin, label }: BlankCardProps) {
  return (
    <div
      className="absolute rounded-2xl border-2 bg-card shadow-sm"
      style={{ left: origin.x, top: origin.y, width: CARD_SIZE.width, height: CARD_SIZE.height }}
    >
      <span className="absolute start-4 top-3 text-base font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
