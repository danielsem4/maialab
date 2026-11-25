import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceQuestion } from "../../components/ChoiceQuestion";
import { PAIN_TYPES } from "../tensData";

/** A single-choice question: one answer card at a time, then Next. */
export function PainTypeTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const options = PAIN_TYPES.map((type) => ({ value: type, label: t(`demos.tens.tasks.painType.options.${type}`) }));

  function handleDone() {
    onComplete(true);
  }

  return <ChoiceQuestion instruction={t("demos.tens.tasks.painType.instruction")} options={options} onDone={handleDone} />;
}
