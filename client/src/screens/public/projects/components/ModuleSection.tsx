import type { CSSProperties, ReactNode } from "react";
import { Puzzle } from "lucide-react";
import type { IProject } from "@/common/types/Project";
import { ProjectCard } from "@/components/common/ProjectCard";
import { useProjectPeriod } from "@/hooks/common/useProjectPeriod";
import { useReveal } from "@/hooks/common/useReveal";

interface ModuleSectionProps {
  id: string;
  title: string;
  projects: IProject[];
  /** Chip text shown on every card, e.g. "Module of DMT – Proms++". */
  moduleOf: string;
  /** Number the cards 1, 2, 3… instead of marking them with the module icon. */
  numbered?: boolean;
  action?: ReactNode;
}

/** A titled group of the app's modules; the cards plug in one after another when the group scrolls into view. */
export function ModuleSection({ id, title, projects, moduleOf, numbered, action }: ModuleSectionProps) {
  const formatPeriod = useProjectPeriod();
  const [ref, revealed] = useReveal<HTMLElement>();

  if (projects.length === 0) return null;

  return (
    <section ref={ref} data-revealed={revealed} aria-labelledby={id}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 sm:mb-5">
        <h3 id={id} className="text-start font-display text-lg font-semibold sm:text-xl">
          {title}
        </h3>
        {action}
      </div>
      <ol className="grid gap-x-5 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <li key={project.id} style={{ "--i": index } as CSSProperties} className="story-item relative">
            <span
              aria-hidden
              className="absolute -top-3 start-4 z-10 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm"
            >
              {numbered ? index + 1 : <Puzzle className="size-3.5" />}
            </span>
            <ProjectCard project={project} period={formatPeriod(project.startDate, project.endDate)} moduleOf={moduleOf} />
          </li>
        ))}
      </ol>
    </section>
  );
}
