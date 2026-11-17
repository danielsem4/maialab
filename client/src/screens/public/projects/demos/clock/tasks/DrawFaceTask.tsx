import { useTranslation } from "react-i18next";
import { Eraser } from "lucide-react";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { pointsToPath } from "@/common/utils/geometry";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { useDrawFace } from "../hooks/useDrawFace";

/** Draw the clock's face freehand — scored as a roughly round, closed circle. */
export function DrawFaceTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { svgRef, strokes, handlers, clear, handleDone, hasDrawing, showHint } = useDrawFace(onComplete);

  return (
    <TaskLayout instruction={t("demos.clock.tasks.face.instruction")}>
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
            {t("demos.clock.clear")}
          </Button>
          <Button size="lg" className="h-16 text-xl" onClick={handleDone} disabled={!hasDrawing}>
            {t("demos.clock.done")}
          </Button>
          {showHint && <p className="text-center text-lg text-muted-foreground">{t("demos.common.tryAgainHint")}</p>}
        </div>
      </div>
    </TaskLayout>
  );
}
