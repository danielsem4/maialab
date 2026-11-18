import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceButton } from "../../components/ChoiceButton";
import { TaskLayout } from "../../components/TaskLayout";
import { PICTURE_OPTIONS, TARGET_PICTURE_ID } from "../palpaData";

/** Written word–picture matching: read the word, tap the picture it names. */
export function WordPictureTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();

  function handleSelect(id: string) {
    onComplete(id === TARGET_PICTURE_ID);
  }

  return (
    <TaskLayout instruction={t("demos.palpa.tasks.wordPicture.instruction")}>
      <div className="flex size-full flex-col items-center justify-center gap-10 pb-10">
        <p className="rounded-2xl border-2 border-primary bg-primary/5 px-14 py-5 font-display text-5xl font-bold">
          {t("demos.palpa.tasks.wordPicture.word")}
        </p>
        <div className="grid grid-cols-4 gap-6">
          {PICTURE_OPTIONS.map((option) => (
            <ChoiceButton
              key={option.id}
              value={option.id}
              onSelect={handleSelect}
              aria-label={t(option.labelKey)}
              className="flex size-44 items-center justify-center text-8xl hover:border-primary"
            >
              <span aria-hidden>{option.emoji}</span>
            </ChoiceButton>
          ))}
        </div>
      </div>
    </TaskLayout>
  );
}
