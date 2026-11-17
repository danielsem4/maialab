import { useTranslation } from "react-i18next";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import type { IDemoTask } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";

interface DemoResultProps {
  tasks: IDemoTask[];
  results: boolean[];
  score: number;
  onRestart: () => void;
}

export function DemoResult({ tasks, results, score, onRestart }: DemoResultProps) {
  const { t } = useTranslation();

  return (
    <div className="flex size-full flex-col items-center justify-center gap-6 overflow-y-auto px-10 py-6">
      <h3 className="font-display text-3xl font-bold">{t("demos.common.done")}</h3>
      <p className="text-xl">{t("demos.common.score", { score, total: tasks.length })}</p>
      <ul className="w-full max-w-md space-y-2">
        {tasks.map((task, i) => (
          <li key={task.titleKey} className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-2">
            {results[i] ? (
              <CircleCheck className="size-5 shrink-0 text-primary" aria-label={t("demos.common.passed")} />
            ) : (
              <CircleX className="size-5 shrink-0 text-destructive" aria-label={t("demos.common.failed")} />
            )}
            <span className="text-start">{t(task.titleKey)}</span>
          </li>
        ))}
      </ul>
      <Button size="lg" variant="outline" onClick={onRestart}>
        <RotateCcw className="size-4" />
        {t("demos.common.tryAgain")}
      </Button>
    </div>
  );
}
