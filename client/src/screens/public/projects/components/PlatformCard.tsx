import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { IProject } from "@/common/types/Project";

interface PlatformCardProps {
  project: IProject;
  label: string;
  icon: LucideIcon;
  index: number;
}

/** Large card for one side of the platform (web or app): label, title, summary and cover. */
export function PlatformCard({ project, label, icon: Icon, index }: PlatformCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/projects/${project.slug}`}
      style={{ "--i": index } as CSSProperties}
      className="story-item group flex h-full flex-col overflow-hidden rounded-2xl glass transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="flex flex-1 flex-col gap-3 p-5 text-start sm:p-6">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4" aria-hidden />
          </span>
          {label}
        </span>
        <h3 className="font-display text-xl leading-snug font-bold sm:text-2xl text-balance transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        {project.summary && <p className="line-clamp-4 text-sm text-muted-foreground">{project.summary}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
          {t("projects.toProject")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </span>
      </div>
      <div className="flex h-40 items-center justify-center bg-primary/10 p-4 sm:h-48">
        {project.cover ? (
          <img src={project.cover.url} alt="" loading="lazy" className="max-h-full max-w-full rounded-lg object-contain" />
        ) : (
          <Icon className="size-16 text-primary/40" aria-hidden />
        )}
      </div>
    </Link>
  );
}
