import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminMembers, useDeleteMember, useSaveMember } from "@/hooks/queries/useMemberQueries";
import {
  EMPTY_MEMBER_FORM,
  formToMemberInput,
  memberFormSchema,
  memberToForm,
  type MemberFormValues,
} from "../schema/memberFormSchema";

const LIST_PATH = "/admin/members";

export function useMemberEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const memberId = params["id"] ? Number(params["id"]) : null;
  const membersQuery = useAdminMembers();
  const member = memberId ? membersQuery.data?.find((m) => m.id === memberId) : undefined;
  const isMissing = memberId !== null && membersQuery.isSuccess && !member;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: EMPTY_MEMBER_FORM,
  });
  const { reset } = form;

  useEffect(() => {
    if (member) reset(memberToForm(member));
  }, [member, reset]);

  const handleSaved = () => {
    navigate(LIST_PATH);
  };

  const save = useSaveMember(memberId, handleSaved);
  const remove = useDeleteMember();

  const handleSubmit = form.handleSubmit((values) => save.mutate(formToMemberInput(values)));

  const handleDelete = () => {
    if (memberId) remove.mutate(memberId, { onSuccess: handleSaved });
  };

  return {
    form,
    member,
    isNew: memberId === null,
    isLoading: memberId !== null && membersQuery.isLoading,
    isError: membersQuery.isError || isMissing,
    isSaving: save.isPending,
    handleSubmit,
    handleDelete,
  };
}
