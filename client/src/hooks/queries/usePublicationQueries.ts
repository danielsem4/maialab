import { useQuery } from "@tanstack/react-query";
import { publicationsApi } from "@/api/publicationsApi";
import type { IPublicationInput } from "@/common/types/Publication";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function usePublishedPublications() {
  return useQuery({ queryKey: queryKeys.publications.public(), queryFn: publicationsApi.listPublished });
}

export function useAdminPublications() {
  return useQuery({ queryKey: queryKeys.publications.admin(), queryFn: publicationsApi.listAll });
}

export function useSavePublication(id: number | null, onSaved?: () => void) {
  return useApiMutation({
    mutationFn: (input: IPublicationInput) => (id ? publicationsApi.update(id, input) : publicationsApi.create(input)),
    invalidate: [queryKeys.publications.all, queryKeys.projects.all, queryKeys.dashboard],
    successKey: id ? "publications.updated" : "publications.created",
    onSuccess: onSaved,
  });
}

export function useDeletePublication() {
  return useApiMutation({
    mutationFn: publicationsApi.remove,
    invalidate: [queryKeys.publications.all, queryKeys.projects.all, queryKeys.dashboard],
    successKey: "common.deleted",
  });
}
