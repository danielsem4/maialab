import { useTranslation } from "react-i18next";
import type { IRect } from "@/common/utils/geometry";
import { diaryCellId, rectStyle, type IDropTarget } from "@/common/utils/memoryUtils";
import { cn } from "@/lib/utils";
import { DIARY_DAYS, DIARY_SLOTS } from "../memoryData";
import { BOARD_SIZE } from "../memoryLayout";

const DIARY = "demos.memory.tasks.diary";
const PAD = 12;
const GAP = 8;
const LABEL_WIDTH = 120;
const HEADER_HEIGHT = 44;
const CELL = {
  width: (BOARD_SIZE.width - 2 * PAD - LABEL_WIDTH - DIARY_DAYS.length * GAP) / DIARY_DAYS.length,
  height: (BOARD_SIZE.height - 2 * PAD - HEADER_HEIGHT - DIARY_SLOTS.length * GAP) / DIARY_SLOTS.length,
};

function cellRect(dayIndex: number, slotIndex: number): IRect {
  return {
    x: PAD + LABEL_WIDTH + GAP + dayIndex * (CELL.width + GAP),
    y: PAD + HEADER_HEIGHT + GAP + slotIndex * (CELL.height + GAP),
    ...CELL,
  };
}

/** The 9 calendar cells (3 days × 3 slots) in diary-local px; map them with `place` from `useBoardLayout`. */
export const DIARY_TARGETS: IDropTarget[] = DIARY_SLOTS.flatMap((slot, s) =>
  DIARY_DAYS.map((day, d) => ({ id: diaryCellId(day, slot), rect: cellRect(d, s) })),
);

interface DiaryGridProps {
  place: (local: IRect) => IRect;
  hoverTargetId: string | null;
}

/** A small weekly planner: days as columns, time slots as rows; each cell is a drop target for one activity. */
export function DiaryGrid({ place, hoverTargetId }: DiaryGridProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute rounded-2xl border bg-card" style={rectStyle(place({ x: 0, y: 0, ...BOARD_SIZE }))} aria-hidden />
      {DIARY_DAYS.map((day, d) => (
        <span
          key={day}
          className="absolute flex items-center justify-center text-xl font-semibold"
          style={rectStyle(place({ x: cellRect(d, 0).x, y: PAD, width: CELL.width, height: HEADER_HEIGHT }))}
        >
          {t(`${DIARY}.days.${day}`)}
        </span>
      ))}
      {DIARY_SLOTS.map((slot, s) => (
        <span
          key={slot}
          className="absolute flex items-center ps-2 text-start text-lg text-muted-foreground"
          style={rectStyle(place({ x: PAD, y: cellRect(0, s).y, width: LABEL_WIDTH, height: CELL.height }))}
        >
          {t(`${DIARY}.slots.${slot}`)}
        </span>
      ))}
      {DIARY_SLOTS.map((slot, s) =>
        DIARY_DAYS.map((day, d) => {
          const cellId = diaryCellId(day, slot);
          return (
            <div
              key={cellId}
              aria-label={`${t(`${DIARY}.days.${day}`)}, ${t(`${DIARY}.slots.${slot}`)}`}
              className={cn(
                "absolute rounded-xl border-2 border-dashed border-border bg-muted/40 transition-colors",
                hoverTargetId === cellId && "border-primary bg-primary/10",
              )}
              style={rectStyle(place(cellRect(d, s)))}
            />
          );
        }),
      )}
    </>
  );
}
