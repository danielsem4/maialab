import type { IProject } from "@/common/types/Project";
import { useProjectPeriod } from "@/hooks/common/useProjectPeriod";
import { ProjectCard } from "./ProjectCard";

interface ProjectIndexProps {
  projects: IProject[];
}

/** Responsive grid of glass project cards. */
export function ProjectIndex({ projects }: ProjectIndexProps) {
  const formatPeriod = useProjectPeriod();

  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} period={formatPeriod(project.startDate, project.endDate)} />
        </li>
      ))}
    </ul>
  );
}
