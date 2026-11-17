import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShapeIcon } from "../../components/ShapeIcon";
import { TaskLayout } from "../../components/TaskLayout";
import { SHAPE_IDS, SHAPE_SIZE, useDragShape } from "../hooks/useDragShape";

/** Mirrors the DMT screen: an empty square on the start side, six outlined shapes on the end side. */
export function DragShapeTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { containerRef, activeId, handlersFor, square, handleDone } = useDragShape(onComplete);

  return (
    <TaskLayout instruction={t("demos.orientation.tasks.drag.instruction")}>
      <div ref={containerRef} className="relative size-full">
        <div
          className="absolute rounded-md border-4 border-primary"
          style={{ left: square.x, top: square.y, width: square.width, height: square.height }}
          aria-hidden
        />
        {SHAPE_IDS.map((id) => {
          const { style, ...handlers } = handlersFor(id);
          return (
            <div
              key={id}
              {...handlers}
              role="img"
              aria-label={t(`demos.orientation.tasks.drag.shapes.${id}`)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 cursor-grab p-2",
                activeId === id && "z-10 cursor-grabbing drop-shadow-lg",
              )}
              style={{ ...style, width: SHAPE_SIZE, height: SHAPE_SIZE }}
            >
              <ShapeIcon kind={id} outline shapeClassName="stroke-primary" />
            </div>
          );
        })}
        <Button size="lg" className="absolute end-8 bottom-5 h-14 px-10 text-lg" onClick={handleDone}>
          {t("demos.orientation.done")}
        </Button>
      </div>
    </TaskLayout>
  );
}
