import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { ImageField } from "@/components/common/ImageField";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import type { ProjectFormValues } from "../schema/projectFormSchema";

interface ProjectContentSectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectContentSection({ form }: ProjectContentSectionProps) {
  const { t } = useTranslation();
  const { control, formState } = form;

  return (
    <FormSection title={t("projects.fields.description")}>
      <FormField id="cover" label={t("projects.fields.cover")}>
        <Controller
          control={control}
          name="cover"
          render={({ field }) => <ImageField id="cover" value={field.value} onChange={field.onChange} />}
        />
      </FormField>
      <FormField id="description" label={t("projects.fields.description")} error={formState.errors.description?.message}>
        <Controller
          control={control}
          name="description"
          render={({ field }) => <MarkdownEditor id="description" value={field.value} onChange={field.onChange} rows={16} />}
        />
      </FormField>
    </FormSection>
  );
}
