import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/usersApi";
import type { IAdminUser, IAdminUserUpdateInput } from "@/common/types/AdminUser";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function useAdminUsers(enabled = true) {
  return useQuery({ queryKey: queryKeys.users, queryFn: usersApi.list, enabled });
}

export function useCreateAdminUser(onSuccess?: (user: IAdminUser) => void) {
  return useApiMutation({
    mutationFn: usersApi.create,
    invalidate: [queryKeys.users, queryKeys.dashboard],
    successKey: "users.created",
    onSuccess,
  });
}

export function useUpdateAdminUser() {
  return useApiMutation({
    mutationFn: ({ id, input }: { id: number; input: IAdminUserUpdateInput }) => usersApi.update(id, input),
    invalidate: [queryKeys.users, queryKeys.dashboard],
    successKey: "users.updated",
  });
}
