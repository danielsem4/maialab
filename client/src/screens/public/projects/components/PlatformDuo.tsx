import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, MonitorCog, Smartphone } from "lucide-react";
import type { IProject } from "@/common/types/Project";
import { cn } from "@/lib/utils";
import { PlatformCard } from "./PlatformCard";

interface PlatformDuoProps {
  web: IProject;
  app: IProject;
}

interface FlowProps {
  label: string;
  reverse?: boolean;
}

/** One direction of the web ↔ app exchange: a moving dashed track on wide screens, an arrow when stacked. */
function Flow({ label, reverse }: FlowProps) {
  const Arrow = reverse ? ArrowUp : ArrowDown;

  return (
    <div className="flex min-w-0 items-center gap-1.5 lg:flex-col">
      <Arrow className="size-4 shrink-0 text-primary lg:hidden" aria-hidden />
      <span className="text-xs font-medium text-muted-foreground lg:max-w-32 lg:text-center">{label}</span>
      <span className={cn("story-flow hidden h-0.5 w-28 rtl:-scale-x-100 lg:block", reverse && "story-flow-reverse")} aria-hidden />
    </div>
  );
}

/** The two sides of the platform side by side — web for clinics, app for patients — with the data flowing between them. */
export function PlatformDuo({ web, app }: PlatformDuoProps) {
  const { t } = useTranslation();

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <PlatformCard project={web} label={t("projects.story.webLabel")} icon={MonitorCog} index={0} />
      <div
        style={{ "--i": 1 } as CSSProperties}
        className="story-item flex items-center justify-center gap-x-6 py-1 lg:flex-col lg:gap-6 lg:py-0"
      >
        <Flow label={t("projects.story.flowToApp")} />
        <Flow label={t("projects.story.flowToWeb")} reverse />
      </div>
      <PlatformCard project={app} label={t("projects.story.appLabel")} icon={Smartphone} index={2} />
    </div>
  );
}
