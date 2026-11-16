import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAdminPublications,
  useDeletePublication,
  useSavePublication,
} from "@/hooks/queries/usePublicationQueries";
import {
  emptyPublicationForm,
  formToPublicationInput,
  publicationFormSchema,
  publicationToForm,
  type PublicationFormValues,
} from "../schema/publicationFormSchema";

const LIST_PATH = "/admin/publications";

export function usePublicationEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const publicationId = params["id"] ? Number(params["id"]) : null;
  const listQuery = useAdminPublications();
  const publication = publicationId ? listQuery.data?.find((p) => p.id === publicationId) : undefined;
  const isMissing = publicationId !== null && listQuery.isSuccess && !publication;

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: emptyPublicationForm(),
  });
  const { reset } = form;

  useEffect(() => {
    if (publication) reset(publicationToForm(publication));
  }, [publication, reset]);

  const handleSaved = () => {
    navigate(LIST_PATH);
  };

  const save = useSavePublication(publicationId, handleSaved);
  const remove = useDeletePublication();

  const handleSubmit = form.handleSubmit((values) => save.mutate(formToPublicationInput(values)));

  const handleDelete = () => {
    if (publicationId) remove.mutate(publicationId, { onSuccess: handleSaved });
  };

  return {
    form,
    publication,
    isNew: publicationId === null,
    isLoading: publicationId !== null && listQuery.isLoading,
    isError: listQuery.isError || isMissing,
    isSaving: save.isPending,
    handleSubmit,
    handleDelete,
  };
}
