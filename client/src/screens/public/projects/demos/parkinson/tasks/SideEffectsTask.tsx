import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceQuestion } from "../../components/ChoiceQuestion";
import { SIDE_EFFECT_OPTIONS } from "../parkinsonData";

/** Multiple-choice evaluation question: every side effect the patient experienced. */
export function SideEffectsTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const options = SIDE_EFFECT_OPTIONS.map((option) => ({
    value: option,
    label: t(`demos.parkinson.tasks.sideEffects.options.${option}`),
  }));

  function handleDone() {
    onComplete(true);
  }

  return <ChoiceQuestion instruction={t("demos.parkinson.tasks.sideEffects.instruction")} options={options} multiple onDone={handleDone} />;
}
