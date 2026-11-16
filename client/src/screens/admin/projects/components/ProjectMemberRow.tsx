import { X } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { IMember } from "@/common/types/Member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectFormValues } from "../schema/projectFormSchema";

interface ProjectMemberRowProps {
  index: number;
  member: IMember | undefined;
  register: UseFormRegister<ProjectFormValues>;
  onRemove: (index: number) => void;
}

export function ProjectMemberRow({ index, member, register, onRemove }: ProjectMemberRowProps) {
  const { t } = useTranslation();

  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <li className="flex items-center gap-3 rounded-lg border p-3">
      {member?.photo ? (
        <img src={member.photo.url} alt="" className="size-10 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="size-10 shrink-0 rounded-full bg-muted" />
      )}
      <span className="min-w-0 flex-1 truncate font-medium">{member?.name ?? "—"}</span>
      <Input
        className="max-w-56"
        aria-label={t("projects.memberRole")}
        placeholder={t("projects.memberRole")}
        dir="auto"
        {...register(`members.${index}.role`)}
      />
      <Button type="button" variant="ghost" size="icon" onClick={handleRemove} aria-label={t("common.remove")}>
        <X className="size-4" />
      </Button>
    </li>
  );
}
