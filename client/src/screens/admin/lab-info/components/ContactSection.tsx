import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LabInfoFormValues } from "../schema/labInfoFormSchema";

interface ContactSectionProps {
  form: UseFormReturn<LabInfoFormValues>;
}

export function ContactSection({ form }: ContactSectionProps) {
  const { t } = useTranslation();
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <FormSection title={t("site.contactTitle")}>
      <FormField id="contactEmail" label={t("labInfo.fields.contactEmail")} error={errors.contactEmail?.message}>
        <Input id="contactEmail" type="email" dir="ltr" {...register("contactEmail")} />
      </FormField>
      <FormField id="address" label={t("labInfo.fields.address")} error={errors.address?.message}>
        <Textarea id="address" rows={3} dir="auto" {...register("address")} />
      </FormField>
      <FormField id="mapUrl" label={t("labInfo.fields.mapUrl")} error={errors.mapUrl?.message}>
        <Input id="mapUrl" type="url" dir="ltr" {...register("mapUrl")} />
      </FormField>
    </FormSection>
  );
}
