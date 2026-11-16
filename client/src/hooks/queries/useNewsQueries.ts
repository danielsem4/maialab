import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/api/newsApi";
import type { INewsPostInput } from "@/common/types/NewsPost";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function usePublishedNews() {
  return useQuery({ queryKey: queryKeys.news.public(), queryFn: () => newsApi.listPublished() });
}

export function useLatestNews(limit = 3) {
  return useQuery({
    queryKey: [...queryKeys.news.public(), "latest", limit],
    queryFn: () => newsApi.listPublished(limit),
  });
}

export function usePublishedNewsPost(slug: string) {
  return useQuery({
    queryKey: queryKeys.news.publicDetail(slug),
    queryFn: () => newsApi.getPublished(slug),
    retry: false,
  });
}

export function useAdminNews() {
  return useQuery({ queryKey: queryKeys.news.admin(), queryFn: newsApi.listAll });
}

export function useAdminNewsPost(id: number | null) {
  return useQuery({
    queryKey: [...queryKeys.news.admin(), id ?? 0],
    queryFn: () => newsApi.get(id!),
    enabled: id !== null,
  });
}

export function useSaveNewsPost(id: number | null, onSaved: (postId: number) => void) {
  return useApiMutation({
    mutationFn: (input: INewsPostInput) => (id ? newsApi.update(id, input) : newsApi.create(input)),
    invalidate: [queryKeys.news.all, queryKeys.dashboard],
    successKey: id ? "news.updated" : "news.created",
    onSuccess: (post) => onSaved(post.id),
  });
}

export function useDeleteNewsPost() {
  return useApiMutation({
    mutationFn: newsApi.remove,
    invalidate: [queryKeys.news.all, queryKeys.dashboard],
    successKey: "common.deleted",
  });
}
