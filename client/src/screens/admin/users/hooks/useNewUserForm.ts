import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAdminUser } from "@/hooks/queries/useUserQueries";
import { EMPTY_USER_FORM, formToUserInput, userFormSchema, type UserFormValues } from "../schema/userFormSchema";

export function useNewUserForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: EMPTY_USER_FORM,
  });

  const handleCreated = () => {
    setOpen(false);
    form.reset(EMPTY_USER_FORM);
  };

  const create = useCreateAdminUser(handleCreated);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) form.reset(EMPTY_USER_FORM);
  };

  const handleSubmit = form.handleSubmit((values) => {
    create.mutate(formToUserInput(values));
  });

  return {
    open,
    form,
    isSubmitting: create.isPending,
    handleOpenChange,
    handleSubmit,
  };
}
