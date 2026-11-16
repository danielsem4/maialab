import type { IProject } from "@/common/types/Project";
import { PublishedBadge } from "@/components/common/PublishedBadge";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectCheckItemProps {
  project: IProject;
  checked: boolean;
  onToggle: (id: number, checked: boolean) => void;
}

export function ProjectCheckItem({ project, checked, onToggle }: ProjectCheckItemProps) {
  const checkboxId = `deck-project-${project.id}`;

  const handleCheckedChange = (state: boolean | "indeterminate") => {
    onToggle(project.id, state === true);
  };

  return (
    <li className="flex items-center gap-3 rounded-lg border p-2 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-accent/40">
      <Checkbox id={checkboxId} checked={checked} onCheckedChange={handleCheckedChange} />
      <label htmlFor={checkboxId} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
        {project.cover ? (
          <img src={project.cover.url} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
        ) : (
          <span className="h-10 w-14 shrink-0 rounded bg-muted" />
        )}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{project.title}</span>
        <PublishedBadge published={project.published} />
      </label>
    </li>
  );
}
