import { useAdminPublications, useDeletePublication } from "@/hooks/queries/usePublicationQueries";

export function usePublicationsList() {
  const query = useAdminPublications();
  const remove = useDeletePublication();

  const handleDelete = (id: number) => {
    remove.mutate(id);
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    publications: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    handleDelete,
    handleRetry,
  };
}
