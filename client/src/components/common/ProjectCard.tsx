import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, FolderKanban } from "lucide-react";
import type { IProject } from "@/common/types/Project";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: IProject;
  period: string;
}

/** Horizontal glass card: text on the start side, cover on a tinted panel at the end. */
export function ProjectCard({ project, period }: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group grid h-full min-h-44 grid-cols-[1fr_8rem] overflow-hidden rounded-xl glass transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:grid-cols-[1fr_10rem]"
    >
      <div className="flex min-w-0 flex-col gap-2 p-5 text-start">
        <h3 className="font-display text-lg leading-snug font-semibold text-balance transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        {project.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{project.summary}</p>}
        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/70">
          <Badge variant="outline">{t(`projects.status.${project.status}`)}</Badge>
          {period && <span>{period}</span>}
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
          {t("projects.toProject")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </span>
      </div>
      <div className="flex items-center justify-center bg-primary/10 p-3">
        {project.cover ? (
          <img
            src={project.cover.url}
            alt=""
            loading="lazy"
            className="max-h-36 w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FolderKanban className="size-10 text-primary/40" aria-hidden />
        )}
      </div>
    </Link>
  );
}
