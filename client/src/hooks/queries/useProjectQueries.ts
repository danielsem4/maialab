import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/api/projectsApi";
import type { IProjectInput } from "@/common/types/Project";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function usePublishedProjects() {
  return useQuery({ queryKey: queryKeys.projects.public(), queryFn: projectsApi.listPublished });
}

export function usePublishedProject(slug: string) {
  return useQuery({
    queryKey: queryKeys.projects.publicDetail(slug),
    queryFn: () => projectsApi.getPublished(slug),
    retry: false,
  });
}

export function useAdminProjects() {
  return useQuery({ queryKey: queryKeys.projects.admin(), queryFn: projectsApi.listAll });
}

export function useAdminProject(id: number | null) {
  return useQuery({
    queryKey: queryKeys.projects.adminDetail(id ?? 0),
    queryFn: () => projectsApi.get(id!),
    enabled: id !== null,
  });
}

export function useSaveProject(id: number | null, onSaved: (projectId: number) => void) {
  return useApiMutation({
    mutationFn: (input: IProjectInput) => (id ? projectsApi.update(id, input) : projectsApi.create(input)),
    invalidate: [queryKeys.projects.all, queryKeys.dashboard],
    successKey: id ? "projects.updated" : "projects.created",
    onSuccess: (project) => onSaved(project.id),
  });
}

export function useDeleteProject() {
  return useApiMutation({
    mutationFn: projectsApi.remove,
    invalidate: [queryKeys.projects.all, queryKeys.dashboard],
    successKey: "common.deleted",
  });
}

export function useReorderProjects() {
  return useApiMutation({
    mutationFn: projectsApi.reorder,
    invalidate: [queryKeys.projects.all],
    successKey: "common.orderSaved",
  });
}
