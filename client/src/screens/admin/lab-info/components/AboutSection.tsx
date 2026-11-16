import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import type { LabInfoFormValues } from "../schema/labInfoFormSchema";

interface AboutSectionProps {
  form: UseFormReturn<LabInfoFormValues>;
}

export function AboutSection({ form }: AboutSectionProps) {
  const { t } = useTranslation();
  const { control, formState } = form;
  const { errors } = formState;

  return (
    <FormSection title={t("labInfo.fields.about")}>
      <FormField id="about" label={t("labInfo.fields.about")} error={errors.about?.message}>
        <Controller
          control={control}
          name="about"
          render={({ field }) => <MarkdownEditor id="about" value={field.value} onChange={field.onChange} rows={12} />}
        />
      </FormField>
      <FormField id="mission" label={t("labInfo.fields.mission")} error={errors.mission?.message}>
        <Controller
          control={control}
          name="mission"
          render={({ field }) => <MarkdownEditor id="mission" value={field.value} onChange={field.onChange} rows={6} />}
        />
      </FormField>
    </FormSection>
  );
}
