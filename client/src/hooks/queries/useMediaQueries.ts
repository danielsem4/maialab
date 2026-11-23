import { useQuery } from "@tanstack/react-query";
import { mediaApi } from "@/api/mediaApi";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function useMediaLibrary(enabled = true) {
  return useQuery({ queryKey: queryKeys.media, queryFn: mediaApi.list, enabled });
}

export function useUploadMedia() {
  return useApiMutation({ mutationFn: mediaApi.upload, invalidate: [queryKeys.media] });
}

export function useUploadVideo() {
  return useApiMutation({ mutationFn: mediaApi.uploadVideo, invalidate: [queryKeys.media] });
}

export function useUpdateMediaAlt() {
  return useApiMutation({
    mutationFn: ({ id, alt }: { id: number; alt: string }) => mediaApi.updateAlt(id, alt),
    invalidate: [queryKeys.media],
    successKey: "media.altSaved",
  });
}

export function useDeleteMedia() {
  return useApiMutation({
    mutationFn: mediaApi.remove,
    invalidate: [queryKeys.media],
    successKey: "common.deleted",
  });
}
