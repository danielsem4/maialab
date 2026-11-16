import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PROJECT_STATUSES } from "@/common/types/Project";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { SwitchField } from "@/components/common/SwitchField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProjectFormValues } from "../schema/projectFormSchema";

interface ProjectDetailsSectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectDetailsSection({ form }: ProjectDetailsSectionProps) {
  const { t } = useTranslation();
  const { register, control, formState } = form;
  const { errors } = formState;

  return (
    <FormSection title={t("projects.editProject")}>
      <FormField id="title" label={t("projects.fields.title")} error={errors.title?.message}>
        <Input id="title" dir="auto" {...register("title")} />
      </FormField>
      <FormField id="slug" label={t("projects.fields.slug")} hint={t("projects.fields.slugHint")} error={errors.slug?.message}>
        <Input id="slug" dir="ltr" {...register("slug")} />
      </FormField>
      <FormField id="summary" label={t("projects.fields.summary")} error={errors.summary?.message}>
        <Textarea id="summary" rows={3} dir="auto" {...register("summary")} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-3">
        <FormField id="status" label={t("projects.fields.status")}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`projects.status.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField id="startDate" label={t("projects.fields.startDate")}>
          <Input id="startDate" type="date" {...register("startDate")} />
        </FormField>
        <FormField id="endDate" label={t("projects.fields.endDate")} error={errors.endDate?.message}>
          <Input id="endDate" type="date" {...register("endDate")} />
        </FormField>
      </div>
      <FormField id="tagsText" label={t("projects.fields.tags")} hint={t("projects.fields.tagsHint")} error={errors.tagsText?.message}>
        <Input id="tagsText" dir="auto" {...register("tagsText")} />
      </FormField>
      <div className="flex flex-wrap gap-6">
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <SwitchField id="published" label={t("projects.fields.published")} checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <SwitchField id="featured" label={t("projects.fields.featured")} checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
    </FormSection>
  );
}
