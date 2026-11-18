import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceButton } from "../../components/ChoiceButton";
import { TaskLayout } from "../../components/TaskLayout";
import { useLexicalDecision } from "../hooks/useLexicalDecision";
import { LEXICAL_ITEMS } from "../palpaData";

/** Lexical decision: is each letter string a real word or not? */
export function LexicalDecisionTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const lexical = useLexicalDecision(LEXICAL_ITEMS, onComplete);

  return (
    <TaskLayout instruction={t("demos.palpa.tasks.lexical.instruction")}>
      <div className="flex size-full flex-col items-center justify-center gap-10 pb-10">
        <span className="text-lg text-muted-foreground">
          {t("demos.common.progress", { current: lexical.index + 1, total: lexical.total })}
        </span>
        <p
          key={lexical.item.id}
          className="flex h-36 min-w-96 items-center justify-center rounded-2xl border-2 bg-card px-12 font-display text-6xl font-bold shadow-sm"
        >
          {t(lexical.item.textKey)}
        </p>
        <div className="flex gap-6">
          <ChoiceButton value={true} onSelect={lexical.answer} className="h-20 w-60 hover:border-primary">
            {t("demos.palpa.tasks.lexical.realWord")}
          </ChoiceButton>
          <ChoiceButton value={false} onSelect={lexical.answer} className="h-20 w-60 hover:border-primary">
            {t("demos.palpa.tasks.lexical.notWord")}
          </ChoiceButton>
        </div>
      </div>
    </TaskLayout>
  );
}
