import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { Input } from "@/components/ui/input";
import { SOCIAL_KEYS, type LabInfoFormValues } from "../schema/labInfoFormSchema";

interface SocialLinksSectionProps {
  form: UseFormReturn<LabInfoFormValues>;
}

export function SocialLinksSection({ form }: SocialLinksSectionProps) {
  const { t } = useTranslation();
  const { register, formState } = form;
  const errors = formState.errors.socialLinks;

  return (
    <FormSection title={t("labInfo.socialLinks")}>
      <div className="grid gap-5 sm:grid-cols-2">
        {SOCIAL_KEYS.map((key) => (
          <FormField key={key} id={`social-${key}`} label={t(`labInfo.fields.${key}`)} error={errors?.[key]?.message}>
            <Input id={`social-${key}`} type="url" dir="ltr" placeholder="https://" {...register(`socialLinks.${key}`)} />
          </FormField>
        ))}
      </div>
    </FormSection>
  );
}
