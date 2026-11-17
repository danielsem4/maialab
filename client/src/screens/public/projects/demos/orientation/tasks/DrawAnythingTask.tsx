import { useTranslation } from "react-i18next";
import { Eraser } from "lucide-react";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { pointsToPath } from "@/common/utils/geometry";
import { totalPoints } from "@/common/utils/orientationUtils";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { useFreehand } from "../../hooks/useFreehand";

/** Any drawing with at least this many recorded points counts as a real attempt. */
const MIN_POINTS = 10;

/** Free drawing with the finger — passes once there is a real drawing when "Done" is pressed. */
export function DrawAnythingTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { svgRef, strokes, handlers, clear } = useFreehand();
  const hasDrawing = strokes.length > 0;

  function handleDone() {
    onComplete(totalPoints(strokes) >= MIN_POINTS);
  }

  return (
    <TaskLayout instruction={t("demos.orientation.tasks.draw.instruction")}>
      <div className="flex size-full gap-6 px-8 pb-6">
        <svg
          ref={svgRef}
          className="h-full min-w-0 flex-1 cursor-crosshair rounded-2xl border-2 border-dashed border-border bg-muted/30"
          {...handlers}
        >
          {strokes.map((stroke, i) => (
            <path
              key={i}
              d={pointsToPath(stroke)}
              className="fill-none stroke-foreground"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
        <div className="flex w-48 flex-col justify-center gap-4">
          <Button variant="outline" size="lg" className="h-16 text-xl" onClick={clear} disabled={!hasDrawing}>
            <Eraser className="size-6" />
            {t("demos.orientation.clear")}
          </Button>
          <Button size="lg" className="h-16 text-xl" onClick={handleDone} disabled={!hasDrawing}>
            {t("demos.orientation.done")}
          </Button>
        </div>
      </div>
    </TaskLayout>
  );
}
