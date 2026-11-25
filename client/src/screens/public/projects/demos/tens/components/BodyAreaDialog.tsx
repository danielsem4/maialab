import { useTranslation } from "react-i18next";
import type { IBodyRegion } from "@/common/types/Tens";
import { Button } from "@/components/ui/button";
import { OptionCard } from "../../components/OptionCard";

interface BodyAreaDialogProps {
  region: IBodyRegion;
  selected: string[];
  onToggle: (areaId: string) => void;
  onClose: () => void;
}

/** A sheet over the body map listing one region's areas as multi-select cards. Stays inside the device frame. */
export function BodyAreaDialog({ region, selected, onToggle, onClose }: BodyAreaDialogProps) {
  const { t } = useTranslation();
  const title = t(`demos.tens.tasks.bodyMap.regions.${region.id}`);

  return (
    <div className="absolute inset-0 z-10 flex items-end bg-black/40" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex w-full flex-col gap-4 rounded-t-3xl border-t-2 bg-background px-6 pt-6 pb-10 shadow-xl">
        <div className="text-center">
          <h3 className="font-display text-2xl font-bold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("demos.tens.tasks.bodyMap.dialogHint")}</p>
        </div>
        <div className="flex flex-col gap-3" role="group" aria-label={title}>
          {region.areas.map((area) => (
            <OptionCard
              key={area}
              value={area}
              label={t(`demos.tens.tasks.bodyMap.areas.${area}`)}
              selected={selected.includes(area)}
              multiple
              onSelect={onToggle}
            />
          ))}
        </div>
        <Button size="lg" className="h-14 w-full text-lg" onClick={onClose}>
          {t("demos.tens.tasks.bodyMap.confirm")}
        </Button>
      </div>
    </div>
  );
}
