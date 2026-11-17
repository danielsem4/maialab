import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface DemoProgressProps {
  index: number;
  total: number;
}

/** Numbered step chips like the DMT evaluation screens: done steps tinted, the current one filled. */
export function DemoProgress({ index, total }: DemoProgressProps) {
  const { t } = useTranslation();

  return (
    <ol className="flex justify-center gap-3 px-6 pt-4" aria-label={t("demos.common.progress", { current: index + 1, total })}>
      {Array.from({ length: total }, (_, i) => (
        <li
          key={i}
          aria-current={i === index ? "step" : undefined}
          className={cn(
            "flex size-11 items-center justify-center rounded-lg text-lg font-semibold",
            i === index && "bg-primary text-primary-foreground",
            i < index && "bg-primary/30 text-foreground",
            i > index && "bg-muted text-muted-foreground",
          )}
        >
          {i + 1}
        </li>
      ))}
    </ol>
  );
}
