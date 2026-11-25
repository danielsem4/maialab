import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { useScaleSlider } from "../../hooks/useScaleSlider";

const MIN = 0;
const MAX = 10;

/** A 0–10 pain scale sized for the phone; any answer counts once the slider was moved. */
export function PainScaleTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { trackRef, value, moved, percent, trackHandlers, thumbHandlers } = useScaleSlider(MIN, MAX);
  const instruction = t("demos.tens.tasks.scale.instruction");

  function handleNext() {
    onComplete(true);
  }

  return (
    <TaskLayout instruction={instruction}>
      <div className="flex size-full flex-col justify-between px-8 pb-10">
        <div className="flex flex-col items-center gap-8 pt-6">
          <output className="font-display text-8xl font-bold text-primary tabular-nums" aria-live="polite">
            {value}
          </output>
          <div className="w-full px-5" dir="ltr">
            <div ref={trackRef} {...trackHandlers} className="relative h-4 w-full cursor-pointer rounded-full bg-muted">
              <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${percent}%` }} />
              <div
                {...thumbHandlers}
                role="slider"
                tabIndex={0}
                aria-label={instruction}
                aria-valuemin={MIN}
                aria-valuemax={MAX}
                aria-valuenow={value}
                className="absolute top-1/2 size-10 -translate-1/2 rounded-full bg-primary shadow-lg ring-4 ring-background outline-none focus-visible:ring-primary/50"
                style={{ left: `${percent}%` }}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <ScaleEnd number={MIN} label={t("demos.tens.tasks.scale.low")} />
              <ScaleEnd number={MAX} label={t("demos.tens.tasks.scale.high")} />
            </div>
          </div>
        </div>
        <Button size="lg" className="h-14 w-full text-lg" onClick={handleNext} disabled={!moved}>
          {t("demos.common.next")}
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
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-semibold tabular-nums">{number}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
