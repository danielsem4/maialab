import type { IProject } from "@/common/types/Project";
import { useOptimisticReorder } from "@/hooks/common/useOptimisticReorder";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useAdminProjects, useDeleteProject, useReorderProjects } from "@/hooks/queries/useProjectQueries";

export function useProjectsList() {
  const query = useAdminProjects();
  const reorder = useReorderProjects();
  const remove = useDeleteProject();
  const handleReorder = useOptimisticReorder<IProject>(queryKeys.projects.admin(), reorder.mutate);

  const handleDelete = (id: number) => {
    remove.mutate(id);
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    handleReorder,
    handleDelete,
    handleRetry,
  };
}
