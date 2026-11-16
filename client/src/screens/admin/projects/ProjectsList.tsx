import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { SortableList } from "@/components/common/SortableList";
import { Button } from "@/components/ui/button";
import { ProjectListRow } from "./components/ProjectListRow";
import { useProjectsList } from "./hooks/useProjectsList";

const getProjectId = (project: IProject) => project.id;

export default function ProjectsList() {
  const { t } = useTranslation();
  const list = useProjectsList();

  const renderRow = (project: IProject) => <ProjectListRow project={project} onDelete={list.handleDelete} />;

  return (
    <div>
      <AdminPageHeader
        title={t("projects.title")}
        actions={
          <Button asChild>
            <Link to="/admin/projects/new">
              <Plus className="size-4" />
              {t("projects.newProject")}
            </Link>
          </Button>
        }
      />
      <QueryState
        isLoading={list.isLoading}
        isError={list.isError}
        onRetry={list.handleRetry}
        isEmpty={list.projects.length === 0}
        empty={t("projects.empty")}
      >
        <SortableList items={list.projects} getId={getProjectId} onReorder={list.handleReorder} renderItem={renderRow} />
      </QueryState>
    </div>
  );
}
