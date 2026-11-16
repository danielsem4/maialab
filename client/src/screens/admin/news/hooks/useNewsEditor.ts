import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminNewsPost, useDeleteNewsPost, useSaveNewsPost } from "@/hooks/queries/useNewsQueries";
import { emptyNewsForm, formToNewsInput, newsFormSchema, newsToForm, type NewsFormValues } from "../schema/newsFormSchema";

export function useNewsEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const postId = params["id"] ? Number(params["id"]) : null;
  const postQuery = useAdminNewsPost(postId);
  const post = postQuery.data;

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: emptyNewsForm(),
  });
  const { reset } = form;

  useEffect(() => {
    if (post) reset(newsToForm(post));
  }, [post, reset]);

  const handleSaved = (savedId: number) => {
    if (!postId) navigate(`/admin/news/${savedId}`, { replace: true });
  };

  const save = useSaveNewsPost(postId, handleSaved);
  const remove = useDeleteNewsPost();

  const handleSubmit = form.handleSubmit((values) => save.mutate(formToNewsInput(values)));

  const handleDelete = () => {
    if (postId) remove.mutate(postId, { onSuccess: () => navigate("/admin/news") });
  };

  return {
    form,
    post,
    isNew: postId === null,
    isLoading: postQuery.isLoading,
    isError: postQuery.isError,
    isSaving: save.isPending,
    handleSubmit,
    handleDelete,
  };
}
