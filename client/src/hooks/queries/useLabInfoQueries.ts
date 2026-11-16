import { useQuery } from "@tanstack/react-query";
import { labInfoApi } from "@/api/labInfoApi";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function useLabInfo() {
  return useQuery({ queryKey: queryKeys.labInfo, queryFn: labInfoApi.get, staleTime: 5 * 60 * 1000 });
}

export function useUpdateLabInfo() {
  return useApiMutation({
    mutationFn: labInfoApi.update,
    invalidate: [queryKeys.labInfo, queryKeys.dashboard],
    successKey: "labInfo.saved",
  });
}
