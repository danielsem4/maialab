import type { IMember } from "@/common/types/Member";
import { useOptimisticReorder } from "@/hooks/common/useOptimisticReorder";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useAdminMembers, useDeleteMember, useReorderMembers } from "@/hooks/queries/useMemberQueries";

export function useMembersList() {
  const query = useAdminMembers();
  const reorder = useReorderMembers();
  const remove = useDeleteMember();
  const handleReorder = useOptimisticReorder<IMember>(queryKeys.members.admin(), reorder.mutate);

  const handleDelete = (id: number) => {
    remove.mutate(id);
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    handleReorder,
    handleDelete,
    handleRetry,
  };
}
