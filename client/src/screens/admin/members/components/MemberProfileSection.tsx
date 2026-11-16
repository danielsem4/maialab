import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { ImageField } from "@/components/common/ImageField";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import type { MemberFormValues } from "../schema/memberFormSchema";

interface MemberProfileSectionProps {
  form: UseFormReturn<MemberFormValues>;
}

export function MemberProfileSection({ form }: MemberProfileSectionProps) {
  const { t } = useTranslation();
  const { control, formState } = form;

  return (
    <FormSection title={t("members.fields.bio")}>
      <FormField id="photo" label={t("members.fields.photo")}>
        <Controller
          control={control}
          name="photo"
          render={({ field }) => (
            <ImageField id="photo" value={field.value} onChange={field.onChange} aspectClassName="aspect-square max-w-56" />
          )}
        />
      </FormField>
      <FormField id="bio" label={t("members.fields.bio")} error={formState.errors.bio?.message}>
        <Controller
          control={control}
          name="bio"
          render={({ field }) => <MarkdownEditor id="bio" value={field.value} onChange={field.onChange} rows={10} />}
        />
      </FormField>
    </FormSection>
  );
}
