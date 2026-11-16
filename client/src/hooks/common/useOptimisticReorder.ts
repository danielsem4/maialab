import { useQueryClient, type QueryKey } from "@tanstack/react-query";

/**
 * Returns a reorder handler that updates the cached list immediately,
 * then persists the new order of ids.
 */
export function useOptimisticReorder<T extends { id: number }>(queryKey: QueryKey, persist: (ids: number[]) => void) {
  const queryClient = useQueryClient();

  return (items: T[]) => {
    queryClient.setQueryData(queryKey, items);
    persist(items.map((item) => item.id));
  };
}
