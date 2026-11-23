import { useSearchParams } from "react-router-dom";
import { PROJECT_STATUSES, type IProject, type ProjectStatus } from "@/common/types/Project";
import { buildProjectStory } from "@/common/utils/projectStory";
import type { IProjectGroup } from "@/components/common/ProjectGroups";
import { usePublishedProjects } from "@/hooks/queries/useProjectQueries";

const GROUP_ORDER: ProjectStatus[] = ["ACTIVE", "PLANNED", "COMPLETED"];

/** Status filter for the public projects page, kept in the URL (?status=ACTIVE). */
export function useProjectFilter() {
  const query = usePublishedProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("status");
  const status = PROJECT_STATUSES.includes(raw as ProjectStatus) ? (raw as ProjectStatus) : null;

  const all: IProject[] = query.data ?? [];
  const projects = status ? all.filter((p) => p.status === status) : all;
  const groups: IProjectGroup[] = GROUP_ORDER.map((s) => ({ status: s, projects: all.filter((p) => p.status === s) })).filter(
    (g) => g.projects.length > 0,
  );
  const availableStatuses = PROJECT_STATUSES.filter((s) => all.some((p) => p.status === s));

  const handleStatusChange = (next: ProjectStatus | null) => {
    setSearchParams(next ? { status: next } : {}, { replace: true });
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    projects,
    status,
    groups,
    story: status ? null : buildProjectStory(all),
    availableStatuses,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: all.length === 0,
    handleStatusChange,
    handleRetry,
  };
}
