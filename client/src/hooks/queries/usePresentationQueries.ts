import { presentationsApi } from "@/api/presentationsApi";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function useDownloadProjectDeck() {
  return useApiMutation({
    mutationFn: presentationsApi.downloadProjectDeck,
    invalidate: [queryKeys.dashboard],
    successKey: "presentations.downloaded",
  });
}

export function useDownloadLabDeck() {
  return useApiMutation({
    mutationFn: presentationsApi.downloadLabDeck,
    invalidate: [queryKeys.dashboard],
    successKey: "presentations.downloaded",
  });
}
