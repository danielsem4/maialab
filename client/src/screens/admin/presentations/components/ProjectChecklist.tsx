import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { Button } from "@/components/ui/button";
import { ProjectCheckItem } from "./ProjectCheckItem";

interface ProjectChecklistProps {
  projects: IProject[];
  selectedIds: Set<number>;
  showError: boolean;
  onToggle: (id: number, checked: boolean) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

export function ProjectChecklist({ projects, selectedIds, showError, onToggle, onSelectAll, onClear }: ProjectChecklistProps) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-labelledby="deck-projects-label"
      aria-describedby={showError ? "deck-projects-error" : undefined}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span id="deck-projects-label" className="text-sm font-medium">
          {t("presentations.selectProjects")}
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onSelectAll}>
            {t("presentations.selectAll")}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            {t("presentations.clearAll")}
          </Button>
        </div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCheckItem
            key={project.id}
            project={project}
            checked={selectedIds.has(project.id)}
            onToggle={onToggle}
          />
        ))}
      </ul>
      {showError && (
        <p id="deck-projects-error" role="alert" className="text-sm text-destructive">
          {t("presentations.selectAtLeastOne")}
        </p>
      )}
    </div>
  );
}
