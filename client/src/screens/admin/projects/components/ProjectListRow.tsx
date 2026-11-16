import { Pencil, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { PublishedBadge } from "@/components/common/PublishedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectListRowProps {
  project: IProject;
  onDelete: (id: number) => void;
}

export function ProjectListRow({ project, onDelete }: ProjectListRowProps) {
  const { t } = useTranslation();

  const handleDelete = () => {
    onDelete(project.id);
  };

  return (
    <div className="flex items-center gap-3">
      {project.cover ? (
        <img src={project.cover.url} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
      ) : (
        <span className="h-12 w-16 shrink-0 rounded bg-muted" />
      )}
      <div className="min-w-0 flex-1">
        <Link to={`/admin/projects/${project.id}`} className="block truncate font-medium hover:underline">
          {project.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <PublishedBadge published={project.published} />
          <Badge variant="secondary">{t(`projects.status.${project.status}`)}</Badge>
          {project.featured && (
            <Star className="size-4 fill-highlight text-highlight" aria-label={t("projects.fields.featured")} />
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/admin/projects/${project.id}`} aria-label={t("common.edit")}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <ConfirmDeleteButton name={project.title} onConfirm={handleDelete} />
    </div>
  );
}
