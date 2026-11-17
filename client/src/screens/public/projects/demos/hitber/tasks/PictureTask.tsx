import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceButton } from "../../components/ChoiceButton";
import { TaskLayout } from "../../components/TaskLayout";
import { WinterScene } from "../components/WinterScene";

const SEASONS = ["summer", "winter", "spring", "autumn"] as const;
type Season = (typeof SEASONS)[number];
const ANSWER: Season = "winter";

export function PictureTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();

  function handleSelect(season: Season) {
    onComplete(season === ANSWER);
  }

  return (
    <TaskLayout instruction={t("demos.hitber.tasks.picture.instruction")}>
      <div className="flex size-full flex-col items-center gap-8 pt-2 pb-8">
        <div className="min-h-0 flex-1">
          <WinterScene label={t("demos.hitber.tasks.picture.scene")} />
        </div>
        <div className="flex gap-5">
          {SEASONS.map((season) => (
            <ChoiceButton key={season} value={season} onSelect={handleSelect} className="h-20 w-44">
              {t(`demos.hitber.tasks.picture.${season}`)}
            </ChoiceButton>
          ))}
        </div>
      </div>
    </TaskLayout>
  );
}
