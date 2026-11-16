import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/common/utils/apiError";

interface ApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Query keys to refresh after success. */
  invalidate?: QueryKey[];
  /** i18n key for the success toast. Omit for silent success. */
  successKey?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
}

/** useMutation with standard cache invalidation and success/error toasts. */
export function useApiMutation<TData, TVariables>({
  mutationFn,
  invalidate = [],
  successKey,
  onSuccess,
}: ApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      await Promise.all(invalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
      if (successKey) toast.success(t(successKey));
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) ?? t("common.errorGeneric"));
    },
  });
}
