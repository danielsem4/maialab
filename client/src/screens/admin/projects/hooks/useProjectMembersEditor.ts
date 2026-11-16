import { useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { useAdminMembers } from "@/hooks/queries/useMemberQueries";
import type { ProjectFormValues } from "../schema/projectFormSchema";

export function useProjectMembersEditor(form: UseFormReturn<ProjectFormValues>) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "members", keyName: "key" });
  const membersQuery = useAdminMembers();
  const [selectedId, setSelectedId] = useState("");

  const allMembers = membersQuery.data ?? [];
  const memberById = new Map(allMembers.map((m) => [m.id, m]));
  const assignedIds = new Set(fields.map((f) => f.memberId));
  const available = allMembers.filter((m) => !assignedIds.has(m.id));

  const handleAdd = () => {
    const id = Number(selectedId);
    if (id && !assignedIds.has(id)) append({ memberId: id, role: "" });
    setSelectedId("");
  };

  return {
    fields,
    memberById,
    available,
    hasAnyMembers: allMembers.length > 0,
    selectedId,
    setSelectedId,
    handleAdd,
    handleRemove: remove,
  };
}
