import { useTranslation } from "react-i18next";
import type { IProject, ProjectStatus } from "@/common/types/Project";
import { ProjectIndex } from "./ProjectIndex";

export interface IProjectGroup {
  status: ProjectStatus;
  projects: IProject[];
}

interface ProjectGroupsProps {
  groups: IProjectGroup[];
}

/** Project cards split into titled sections, one per status. */
export function ProjectGroups({ groups }: ProjectGroupsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.status} aria-labelledby={`projects-${group.status}`}>
          <h2 id={`projects-${group.status}`} className="mb-4 text-start text-sm font-semibold text-primary">
            {t(`projects.status.${group.status}`)}
          </h2>
          <ProjectIndex projects={group.projects} />
        </section>
      ))}
    </div>
  );
}
