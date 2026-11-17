import { useTranslation } from "react-i18next";
import { RotateCcw, SkipForward } from "lucide-react";
import type { IDemoTask } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { useDemoRunner } from "../hooks/useDemoRunner";
import { DemoIntro } from "./DemoIntro";
import { DemoProgress } from "./DemoProgress";
import { DemoResult } from "./DemoResult";

interface DemoRunnerProps {
  /** i18n key prefix of the demo, e.g. "demos.orientation" — must have `title` and `intro` keys. */
  i18nPrefix: string;
  tasks: IDemoTask[];
}

/** The app shell every demo shares, styled like the DMT app: a cyan title bar, step chips, then the screen. */
export function DemoRunner({ i18nPrefix, tasks }: DemoRunnerProps) {
  const { t } = useTranslation();
  const demo = useDemoRunner(tasks);
  const Task = demo.task?.component;
  const inTask = demo.phase === "task";

  return (
    <div className="flex size-full flex-col select-none">
      <header className="flex items-center gap-2 bg-primary px-4 pt-9 pb-3 text-primary-foreground">
        <Button
          variant="ghost"
          size="icon"
          onClick={demo.restart}
          disabled={!inTask}
          aria-label={t("demos.common.restart")}
          className="hover:bg-white/15 hover:text-primary-foreground disabled:invisible"
        >
          <RotateCcw className="size-5" />
        </Button>
        <h2 className="min-w-0 flex-1 truncate text-center font-display text-2xl font-semibold">{t(`${i18nPrefix}.title`)}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={demo.skip}
          disabled={!inTask}
          className="hover:bg-white/15 hover:text-primary-foreground disabled:invisible"
        >
          {t("demos.common.skip")}
          <SkipForward className="size-4 rtl:rotate-180" />
        </Button>
      </header>
      {inTask && <DemoProgress index={demo.index} total={demo.total} />}
      <div className="relative min-h-0 flex-1">
        {demo.phase === "intro" && <DemoIntro i18nPrefix={i18nPrefix} taskCount={demo.total} onStart={demo.start} />}
        {inTask && Task && <Task key={demo.taskKey} onComplete={demo.complete} />}
        {demo.phase === "result" && (
          <DemoResult tasks={tasks} results={demo.results} score={demo.score} onRestart={demo.start} />
        )}
      </div>
    </div>
  );
}
