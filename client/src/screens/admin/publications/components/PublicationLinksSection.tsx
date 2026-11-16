import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { SwitchField } from "@/components/common/SwitchField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminProjects } from "@/hooks/queries/useProjectQueries";
import { NO_PROJECT, type PublicationFormValues } from "../schema/publicationFormSchema";
import { PdfField } from "./PdfField";

interface PublicationLinksSectionProps {
  form: UseFormReturn<PublicationFormValues>;
}

export function PublicationLinksSection({ form }: PublicationLinksSectionProps) {
  const { t } = useTranslation();
  const { control } = form;
  const projects = useAdminProjects().data ?? [];

  return (
    <FormSection title={t("publications.fields.pdf")}>
      <FormField id="pdf" label={t("publications.fields.pdf")}>
        <Controller
          control={control}
          name="pdf"
          render={({ field }) => <PdfField id="pdf" value={field.value} onChange={field.onChange} />}
        />
      </FormField>
      <FormField id="projectId" label={t("publications.fields.project")}>
        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="projectId" className="w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PROJECT}>{t("common.none")}</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <SwitchField
            id="published"
            label={t("publications.fields.published")}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </FormSection>
  );
}
