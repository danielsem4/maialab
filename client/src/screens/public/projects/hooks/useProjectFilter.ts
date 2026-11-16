import { useSearchParams } from "react-router-dom";
import { PROJECT_STATUSES, type IProject, type ProjectStatus } from "@/common/types/Project";
import { usePublishedProjects } from "@/hooks/queries/useProjectQueries";

/** Status filter for the public projects page, kept in the URL (?status=ACTIVE). */
export function useProjectFilter() {
  const query = usePublishedProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("status");
  const status = PROJECT_STATUSES.includes(raw as ProjectStatus) ? (raw as ProjectStatus) : null;

  const all: IProject[] = query.data ?? [];
  const projects = status ? all.filter((p) => p.status === status) : all;
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
    availableStatuses,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: all.length === 0,
    handleStatusChange,
    handleRetry,
  };
}
