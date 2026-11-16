import type { AdminRole, IAdminUser } from "@/common/types/AdminUser";
import { useAdminUsers, useUpdateAdminUser } from "@/hooks/queries/useUserQueries";
import { useAuthStore } from "@/store/useAuthStore";

export function useUsersList() {
  const currentUserId = useAuthStore((s) => s.userId);
  const role = useAuthStore((s) => s.role);
  const isSuperAdmin = role === "SUPER_ADMIN";
  const query = useAdminUsers(isSuperAdmin);
  const update = useUpdateAdminUser();

  const isCurrentUser = (user: IAdminUser) => String(user.id) === String(currentUserId);

  const handleRoleChange = (user: IAdminUser, nextRole: AdminRole) => {
    if (nextRole === user.role) return;
    update.mutate({ id: user.id, input: { role: nextRole } });
  };

  const handleToggleActive = (user: IAdminUser) => {
    update.mutate({ id: user.id, input: { isActive: !user.isActive } });
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    isSuperAdmin,
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isUpdating: update.isPending,
    isCurrentUser,
    handleRoleChange,
    handleToggleActive,
    handleRetry,
  };
}
