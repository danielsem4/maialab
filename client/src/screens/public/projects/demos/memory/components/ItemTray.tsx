import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { IRect } from "@/common/utils/geometry";
import { rectStyle } from "@/common/utils/memoryUtils";
import { cn } from "@/lib/utils";
import type { DragHandlers } from "../hooks/useDragPlacement";
import type { IMemoryItem } from "../memoryData";
import { ITEM_SIZE, PLACED_ITEM_SIZE, TRAY_HEADING_HEIGHT } from "../memoryLayout";

interface ItemTrayProps {
  items: IMemoryItem[];
  trayRect: IRect;
  activeId: string | null;
  /** Items currently sitting on a target render compact. */
  placements: Record<string, string>;
  handlersFor: (id: string) => DragHandlers;
  /** Rendered at the bottom of the tray column (the Done button). */
  children?: ReactNode;
}

/**
 * The tray column (heading + footer) and the draggable item cards. Cards are positioned by the drag
 * hook in container px, so they live next to the tray rather than inside it and can sit on the board.
 */
export function ItemTray({ items, trayRect, activeId, placements, handlersFor, children }: ItemTrayProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute flex flex-col justify-between" style={rectStyle(trayRect)}>
        <p
          className="flex items-center justify-center text-sm font-semibold text-muted-foreground uppercase"
          style={{ height: TRAY_HEADING_HEIGHT }}
        >
          {t("demos.memory.tray")}
        </p>
        {children}
      </div>
      {items.map((item) => {
        const { style, ...handlers } = handlersFor(item.id);
        const active = activeId === item.id;
        const placed = !active && Boolean(placements[item.id]);
        return (
          <div
            key={item.id}
            {...handlers}
            role="img"
            aria-label={t(item.labelKey)}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab items-center gap-2 rounded-xl border-2 border-border bg-card px-3 text-lg font-medium shadow-sm select-none",
              active && "z-10 scale-105 cursor-grabbing border-primary shadow-lg ring-4 ring-primary/30",
              placed && "gap-1.5 px-2 text-base",
              !active && "transition-[left,top] duration-200",
            )}
            style={{ ...style, ...(placed ? PLACED_ITEM_SIZE : ITEM_SIZE) }}
          >
            <span className={cn("leading-none", placed ? "text-2xl" : "text-3xl")} aria-hidden>
              {item.emoji}
            </span>
            <span className="truncate">{t(item.labelKey)}</span>
          </div>
        );
      })}
    </>
  );
}
