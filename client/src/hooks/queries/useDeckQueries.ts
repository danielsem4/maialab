import { useQuery } from "@tanstack/react-query";
import { decksApi } from "@/api/decksApi";
import type { IDeck } from "@/common/types/Deck";
import { useApiMutation } from "@/hooks/common/useApiMutation";
import { queryKeys } from "./queryKeys";

export function useDecks() {
  return useQuery({ queryKey: queryKeys.decks.list(), queryFn: decksApi.list });
}

/**
 * Loads one deck for the editor. The editor store owns the document after load, so the query never
 * refetches while mounted, and nothing is kept once it unmounts: a cached copy would carry an old
 * `updatedAt` and make the first save of the next visit look like a conflict.
 */
export function useDeck(id: number) {
  return useQuery({
    queryKey: queryKeys.decks.detail(id),
    queryFn: () => decksApi.get(id),
    enabled: id > 0,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}

export function useCreateDeck(onCreated: (deck: IDeck) => void) {
  return useApiMutation({
    mutationFn: decksApi.create,
    invalidate: [queryKeys.decks.all],
    successKey: "decks.created",
    onSuccess: onCreated,
  });
}

export function useDuplicateDeck() {
  return useApiMutation({
    mutationFn: decksApi.duplicate,
    invalidate: [queryKeys.decks.all],
    successKey: "decks.duplicated",
  });
}

export function useDeleteDeck() {
  return useApiMutation({
    mutationFn: decksApi.remove,
    invalidate: [queryKeys.decks.all],
    successKey: "common.deleted",
  });
}
