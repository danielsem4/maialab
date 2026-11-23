import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, FolderKanban, Puzzle } from "lucide-react";
import type { IProject } from "@/common/types/Project";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: IProject;
  period: string;
  /** Chip text marking the project as a module of the app, e.g. "Module of DMT – Proms++". */
  moduleOf?: string;
}

/**
 * Glass project card. Laid out by its own width, not the viewport's: the cover sits on top as a banner,
 * and moves to a tinted panel at the end side once the card itself is wide enough for text beside it.
 */
export function ProjectCard({ project, period, moduleOf }: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group @container block h-full overflow-hidden rounded-xl glass transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="flex h-full flex-col @md:grid @md:min-h-44 @md:grid-cols-[1fr_10rem]">
        <div className="flex h-36 shrink-0 items-center justify-center bg-primary/10 p-3 @md:order-last @md:h-auto">
          {project.cover ? (
            <img
              src={project.cover.url}
              alt=""
              loading="lazy"
              className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105 @md:max-h-36"
            />
          ) : (
            <FolderKanban className="size-10 text-primary/40" aria-hidden />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 text-start sm:p-5">
          {moduleOf && (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <Puzzle className="size-3 shrink-0" aria-hidden />
              {moduleOf}
            </span>
          )}
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
      </div>
    </Link>
  );
}
