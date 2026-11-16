import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { useProjectPeriod } from "@/hooks/common/useProjectPeriod";

interface ProjectIndexProps {
  projects: IProject[];
}

/** The site's signature list: one large typographic row per project, cover revealed on hover. */
export function ProjectIndex({ projects }: ProjectIndexProps) {
  const { t } = useTranslation();
  const formatPeriod = useProjectPeriod();
  const periods = new Map(projects.map((p) => [p.id, formatPeriod(p.startDate, p.endDate)]));

  return (
    <ul className="border-t">
      {projects.map((project) => (
        <li key={project.id} className="border-b">
          <Link
            to={`/projects/${project.slug}`}
            className="group grid gap-x-8 gap-y-3 py-7 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="min-w-0">
              <h3 className="font-display text-3xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary sm:text-4xl lg:text-5xl">
                {project.title}
              </h3>
              {project.summary && <p className="mt-3 max-w-2xl text-muted-foreground">{project.summary}</p>}
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/70">
                <span className="font-medium text-primary">{t(`projects.status.${project.status}`)}</span>
                {periods.get(project.id) && <span>{periods.get(project.id)}</span>}
                {project.tags.length > 0 && <span>{project.tags.join(", ")}</span>}
              </p>
            </div>
            {project.cover && (
              <img
                src={project.cover.url}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full rounded-lg object-cover md:w-56 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
              />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
