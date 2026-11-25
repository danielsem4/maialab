import { useTranslation } from "react-i18next";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoIntroProps {
  i18nPrefix: string;
  taskCount: number;
  onStart: () => void;
}

export function DemoIntro({ i18nPrefix, taskCount, onStart }: DemoIntroProps) {
  const { t } = useTranslation();

  return (
    <div className="flex size-full flex-col items-center justify-center gap-6 px-10 text-center">
      <p className="max-w-xl text-xl leading-relaxed">{t(`${i18nPrefix}.intro`)}</p>
      <p className="text-muted-foreground">{t("demos.common.taskCount", { total: taskCount })}</p>
      <Button size="lg" className="h-14 w-80 max-w-full text-lg" onClick={onStart}>
        <Play className="size-5 rtl:rotate-180" />
        {t("demos.common.start")}
      </Button>
      <p className="max-w-md text-xs text-muted-foreground">{t("demos.common.disclaimer")}</p>
    </div>
  );
}
