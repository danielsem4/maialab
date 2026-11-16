import { Plus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormSection } from "@/components/common/FormSection";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectMembersEditor } from "../hooks/useProjectMembersEditor";
import type { ProjectFormValues } from "../schema/projectFormSchema";
import { ProjectMemberRow } from "./ProjectMemberRow";

interface ProjectMembersSectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectMembersSection({ form }: ProjectMembersSectionProps) {
  const { t } = useTranslation();
  const editor = useProjectMembersEditor(form);

  return (
    <FormSection title={t("projects.team")}>
      {editor.fields.length > 0 && (
        <ul className="space-y-2">
          {editor.fields.map((field, index) => (
            <ProjectMemberRow
              key={field.key}
              index={index}
              member={editor.memberById.get(field.memberId)}
              register={form.register}
              onRemove={editor.handleRemove}
            />
          ))}
        </ul>
      )}
      {editor.hasAnyMembers ? (
        <div className="flex flex-wrap items-center gap-2">
          <Select value={editor.selectedId} onValueChange={editor.setSelectedId}>
            <SelectTrigger className="w-64" aria-label={t("projects.addMember")}>
              <SelectValue placeholder={t("projects.addMember")} />
            </SelectTrigger>
            <SelectContent>
              {editor.available.map((member) => (
                <SelectItem key={member.id} value={String(member.id)}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={editor.handleAdd} disabled={!editor.selectedId}>
            <Plus className="size-4" />
            {t("common.add")}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("projects.noMembersToAdd")}</p>
      )}
    </FormSection>
  );
}
