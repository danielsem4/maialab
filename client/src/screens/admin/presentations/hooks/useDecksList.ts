import { useDecks, useDeleteDeck, useDuplicateDeck } from "@/hooks/queries/useDeckQueries";

export function useDecksList() {
  const query = useDecks();
  const duplicate = useDuplicateDeck();
  const remove = useDeleteDeck();
  const decks = query.data ?? [];

  const handleDuplicate = (id: number) => {
    duplicate.mutate(id);
  };

  const handleDelete = (id: number) => {
    remove.mutate(id);
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    decks,
    templates: decks.filter((deck) => deck.isTemplate),
    isLoading: query.isLoading,
    isError: query.isError,
    isDuplicating: duplicate.isPending,
    handleDuplicate,
    handleDelete,
    handleRetry,
  };
}
