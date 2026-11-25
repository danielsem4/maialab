import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useChoiceAnswer } from "../hooks/useChoiceAnswer";
import { OptionCard } from "./OptionCard";
import { TaskLayout } from "./TaskLayout";

export interface IChoiceOption {
  value: string;
  label: string;
}

interface ChoiceQuestionProps {
  instruction: string;
  options: IChoiceOption[];
  /** Lets several answers be chosen; otherwise picking one replaces the last. */
  multiple?: boolean;
  onDone: () => void;
}

/** An evaluation question answered with cards — single or multiple choice — and a Next button. */
export function ChoiceQuestion({ instruction, options, multiple, onDone }: ChoiceQuestionProps) {
  const { t } = useTranslation();
  const answer = useChoiceAnswer(multiple);

  return (
    <TaskLayout instruction={instruction}>
      <div className="flex size-full flex-col gap-4 px-8 pb-10">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-1" role="group" aria-label={instruction}>
          {options.map((option) => (
            <OptionCard
              key={option.value}
              value={option.value}
              label={option.label}
              selected={answer.selected.includes(option.value)}
              multiple={multiple}
              onSelect={answer.select}
            />
          ))}
        </div>
        <Button size="lg" className="h-14 w-full shrink-0 text-lg" onClick={onDone} disabled={!answer.answered}>
          {t("demos.common.next")}
        </Button>
      </div>
    </TaskLayout>
  );
}
