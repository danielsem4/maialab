import { useQuery } from "@tanstack/react-query";
import { membersApi } from "@/api/membersApi";
import type { IMemberInput } from "@/common/types/Member";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function usePublishedMembers() {
  return useQuery({ queryKey: queryKeys.members.public(), queryFn: membersApi.listPublished });
}

export function useAdminMembers() {
  return useQuery({ queryKey: queryKeys.members.admin(), queryFn: membersApi.listAll });
}

export function useSaveMember(id: number | null, onSaved?: () => void) {
  return useApiMutation({
    mutationFn: (input: IMemberInput) => (id ? membersApi.update(id, input) : membersApi.create(input)),
    invalidate: [queryKeys.members.all, queryKeys.projects.all, queryKeys.dashboard],
    successKey: id ? "members.updated" : "members.created",
    onSuccess: onSaved,
  });
}

export function useDeleteMember() {
  return useApiMutation({
    mutationFn: membersApi.remove,
    invalidate: [queryKeys.members.all, queryKeys.projects.all, queryKeys.dashboard],
    successKey: "common.deleted",
  });
}

export function useReorderMembers() {
  return useApiMutation({
    mutationFn: membersApi.reorder,
    invalidate: [queryKeys.members.all],
    successKey: "common.orderSaved",
  });
}
