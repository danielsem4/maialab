import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLabInfo, useUpdateLabInfo } from "@/hooks/queries/useLabInfoQueries";
import {
  EMPTY_LAB_INFO_FORM,
  formToLabInfoInput,
  labInfoFormSchema,
  labInfoToForm,
  type LabInfoFormValues,
} from "../schema/labInfoFormSchema";

export function useLabInfoEditor() {
  const query = useLabInfo();
  const update = useUpdateLabInfo();
  const labInfo = query.data;

  const form = useForm<LabInfoFormValues>({
    resolver: zodResolver(labInfoFormSchema),
    defaultValues: EMPTY_LAB_INFO_FORM,
  });
  const { reset } = form;

  useEffect(() => {
    if (labInfo !== undefined) reset(labInfoToForm(labInfo));
  }, [labInfo, reset]);

  const handleSubmit = form.handleSubmit((values) => update.mutate(formToLabInfoInput(values)));

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    form,
    isLoading: query.isLoading,
    isError: query.isError,
    isSaving: update.isPending,
    handleSubmit,
    handleRetry,
  };
}
