import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskLayout } from "../../components/TaskLayout";
import { useTypedAnswer } from "../hooks/useTypedAnswer";
import { NAMING_EMOJI } from "../palpaData";

/** Written picture naming: type the name of the picture. */
export function PictureNamingTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const answer = useTypedAnswer(t("demos.palpa.tasks.naming.answers"), onComplete);

  return (
    <TaskLayout instruction={t("demos.palpa.tasks.naming.instruction")}>
      <form onSubmit={answer.handleSubmit} className="flex size-full flex-col items-center justify-center gap-8 pb-10">
        <span role="img" aria-label={t("demos.palpa.pictures.house")} className="text-9xl">
          {NAMING_EMOJI}
        </span>
        <Input
          value={answer.value}
          onChange={answer.handleChange}
          dir="auto"
          autoComplete="off"
          aria-label={t("demos.palpa.tasks.naming.label")}
          placeholder={t("demos.palpa.tasks.naming.placeholder")}
          className="h-16 w-96 bg-card text-center text-3xl md:text-3xl"
        />
        <Button type="submit" size="lg" className="h-14 px-12 text-lg" disabled={!answer.canSubmit}>
          {t("demos.common.next")}
        </Button>
      </form>
    </TaskLayout>
  );
}
