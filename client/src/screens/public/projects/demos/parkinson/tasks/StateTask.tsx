import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceQuestion } from "../../components/ChoiceQuestion";
import { STATE_OPTIONS } from "../parkinsonData";

/** Single-choice evaluation question: the patient's ON/OFF state right now. */
export function StateTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const options = STATE_OPTIONS.map((option) => ({ value: option, label: t(`demos.parkinson.tasks.state.options.${option}`) }));

  function handleDone() {
    onComplete(true);
  }

  return <ChoiceQuestion instruction={t("demos.parkinson.tasks.state.instruction")} options={options} onDone={handleDone} />;
}
