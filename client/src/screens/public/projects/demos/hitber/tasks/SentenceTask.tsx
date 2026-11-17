import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChoiceButton } from "../../components/ChoiceButton";
import { TaskLayout } from "../../components/TaskLayout";
import { useSentenceBuilder } from "../hooks/useSentenceBuilder";

const CARD = "h-16 px-6 text-2xl";

export function SentenceTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { words, pool, picked, isComplete, place, remove, handleDone } = useSentenceBuilder(
    t("demos.hitber.tasks.sentence.sentence"),
    onComplete,
  );

  return (
    <TaskLayout instruction={t("demos.hitber.tasks.sentence.instruction")}>
      <div className="flex size-full flex-col items-center gap-10 px-12 pt-4">
        <div className="flex min-h-28 w-full flex-wrap content-center items-center gap-3 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 p-5">
          {picked.length === 0 && (
            <span className="w-full text-center text-lg text-muted-foreground">{t("demos.hitber.tasks.sentence.placeholder")}</span>
          )}
          {picked.map((index) => (
            <ChoiceButton key={index} value={index} onSelect={remove} className={cn(CARD, "border-primary")}>
              {words[index]}
            </ChoiceButton>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {pool.map((index) => (
            <ChoiceButton
              key={index}
              value={index}
              onSelect={place}
              disabled={picked.includes(index)}
              className={cn(CARD, picked.includes(index) && "invisible")}
            >
              {words[index]}
            </ChoiceButton>
          ))}
        </div>
        <Button size="lg" className="h-14 px-10 text-lg" disabled={!isComplete} onClick={handleDone}>
          {t("demos.common.next")}
        </Button>
      </div>
    </TaskLayout>
  );
}
