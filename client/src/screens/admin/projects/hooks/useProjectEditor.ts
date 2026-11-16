import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminProject, useDeleteProject, useSaveProject } from "@/hooks/queries/useProjectQueries";
import { useDownloadProjectDeck } from "@/hooks/queries/usePresentationQueries";
import {
  EMPTY_PROJECT_FORM,
  formToProjectInput,
  projectFormSchema,
  projectToForm,
  type ProjectFormValues,
} from "../schema/projectFormSchema";

export function useProjectEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params["id"] ? Number(params["id"]) : null;
  const projectQuery = useAdminProject(projectId);
  const project = projectQuery.data;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: EMPTY_PROJECT_FORM,
  });
  const { reset } = form;

  useEffect(() => {
    if (project) reset(projectToForm(project));
  }, [project, reset]);

  const handleSaved = (savedId: number) => {
    if (!projectId) navigate(`/admin/projects/${savedId}`, { replace: true });
  };

  const save = useSaveProject(projectId, handleSaved);
  const remove = useDeleteProject();
  const exportDeck = useDownloadProjectDeck();

  const handleSubmit = form.handleSubmit((values) => save.mutate(formToProjectInput(values)));

  const handleDelete = () => {
    if (projectId) remove.mutate(projectId, { onSuccess: () => navigate("/admin/projects") });
  };

  const handleExport = () => {
    if (projectId) exportDeck.mutate(projectId);
  };

  return {
    form,
    project,
    isNew: projectId === null,
    isLoading: projectQuery.isLoading,
    isError: projectQuery.isError,
    isSaving: save.isPending,
    isExporting: exportDeck.isPending,
    handleSubmit,
    handleDelete,
    handleExport,
  };
}
