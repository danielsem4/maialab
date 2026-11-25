import type { IBodyRegion } from "@/common/types/Tens";
import { BODY_HEIGHT, BODY_WIDTH } from "../tensData";

interface BodyDotProps {
  region: IBodyRegion;
  label: string;
  /** How many of the region's areas are chosen. */
  count: number;
  onSelect: (regionId: string) => void;
}

/** A tappable dot over the figure: hollow until one of its areas is chosen, then filled with the count. */
export function BodyDot({ region, label, count, onSelect }: BodyDotProps) {
  function handleClick() {
    onSelect(region.id);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={count > 0}
      className="absolute flex size-7 -translate-1/2 items-center justify-center rounded-full border-2 border-primary bg-primary/25 text-sm font-bold text-primary-foreground shadow-sm ring-4 ring-primary/20 transition outline-none focus-visible:ring-primary/60 active:scale-90 aria-pressed:bg-primary"
      style={{ left: `${(region.x / BODY_WIDTH) * 100}%`, top: `${(region.y / BODY_HEIGHT) * 100}%` }}
    >
      {count > 0 && count}
    </button>
  );
}
