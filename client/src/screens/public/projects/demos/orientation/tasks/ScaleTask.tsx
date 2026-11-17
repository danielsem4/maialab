import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { useScaleSlider } from "../hooks/useScaleSlider";

const MIN = 0;
const MAX = 10;

/** A 0–10 feeling scale with a big draggable thumb; any answer passes once the slider was moved. */
export function ScaleTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { trackRef, value, moved, percent, trackHandlers, thumbHandlers } = useScaleSlider(MIN, MAX);

  function handleDone() {
    onComplete(true);
  }

  return (
    <TaskLayout instruction={t("demos.orientation.tasks.scale.instruction")}>
      <div className="flex size-full flex-col items-center justify-center gap-10">
        <output className="font-display text-8xl font-bold text-primary tabular-nums" aria-live="polite">
          {value}
        </output>
        <div className="flex items-center gap-8" dir="ltr">
          <ScaleEnd number={MIN} label={t("demos.orientation.tasks.scale.low")} />
          <div ref={trackRef} {...trackHandlers} className="relative h-5 w-[700px] cursor-pointer rounded-full bg-muted">
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${percent}%` }} />
            <div
              {...thumbHandlers}
              role="slider"
              tabIndex={0}
              aria-label={t("demos.orientation.tasks.scale.question")}
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={value}
              className="absolute top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg ring-4 ring-background outline-none focus-visible:ring-primary/50"
              style={{ left: `${percent}%` }}
            />
          </div>
          <ScaleEnd number={MAX} label={t("demos.orientation.tasks.scale.high")} />
        </div>
        <Button size="lg" className="h-14 px-12 text-lg" onClick={handleDone} disabled={!moved}>
          {t("demos.orientation.done")}
        </Button>
      </div>
    </TaskLayout>
  );
}

interface ScaleEndProps {
  number: number;
  label: string;
}

function ScaleEnd({ number, label }: ScaleEndProps) {
  return (
    <div className="flex w-24 flex-col items-center gap-1">
      <span className="text-4xl font-semibold tabular-nums">{number}</span>
      <span className="text-center text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
