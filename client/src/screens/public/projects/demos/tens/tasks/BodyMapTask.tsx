import { useTranslation } from "react-i18next";
import { RefreshCw } from "lucide-react";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { TaskLayout } from "../../components/TaskLayout";
import { BodyAreaDialog } from "../components/BodyAreaDialog";
import { BodyDot } from "../components/BodyDot";
import { BodyFigure } from "../components/BodyFigure";
import { useBodyMap } from "../hooks/useBodyMap";

/** The pain map: tap a dot on the body, pick the areas that hurt in its dialog, flip to the other side. */
export function BodyMapTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const map = useBodyMap();

  function handleNext() {
    onComplete(true);
  }

  return (
    <TaskLayout instruction={t("demos.tens.tasks.bodyMap.instruction")}>
      <div className="flex size-full flex-col items-center justify-between gap-2 px-8 pb-10">
        <Button variant="ghost" className="text-lg font-semibold text-primary" onClick={map.flip}>
          <RefreshCw className="size-5" aria-hidden />
          {t(`demos.tens.tasks.bodyMap.${map.side}`)}
          <span className="sr-only">{t("demos.tens.tasks.bodyMap.rotate")}</span>
        </Button>
        {/* Left-to-right always: the dots are placed by x, and a body's sides must not mirror in RTL. */}
        <div className="relative aspect-[5/11] min-h-0 flex-1" dir="ltr">
          <BodyFigure side={map.side} />
          {map.regions.map((region) => (
            <BodyDot
              key={region.id}
              region={region}
              label={t(`demos.tens.tasks.bodyMap.regions.${region.id}`)}
              count={map.selection[region.id]?.length ?? 0}
              onSelect={map.openDialog}
            />
          ))}
        </div>
        <Button size="lg" className="h-14 w-full text-lg" onClick={handleNext} disabled={map.selectedCount === 0}>
          {t("demos.common.next")}
        </Button>
      </div>
      {map.openRegion && (
        <BodyAreaDialog
          region={map.openRegion}
          selected={map.selection[map.openRegion.id] ?? []}
          onToggle={map.toggleOpenArea}
          onClose={map.closeDialog}
        />
      )}
    </TaskLayout>
  );
}
