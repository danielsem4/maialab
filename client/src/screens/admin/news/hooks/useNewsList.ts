import { useAdminNews, useDeleteNewsPost } from "@/hooks/queries/useNewsQueries";

export function useNewsList() {
  const query = useAdminNews();
  const remove = useDeleteNewsPost();

  const handleDelete = (id: number) => {
    remove.mutate(id);
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    handleDelete,
    handleRetry,
  };
}
