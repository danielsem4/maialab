import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { ImageField } from "@/components/common/ImageField";
import { Input } from "@/components/ui/input";
import type { LabInfoFormValues } from "../schema/labInfoFormSchema";

interface IdentitySectionProps {
  form: UseFormReturn<LabInfoFormValues>;
}

export function IdentitySection({ form }: IdentitySectionProps) {
  const { t } = useTranslation();
  const { register, control, formState } = form;
  const { errors } = formState;

  return (
    <FormSection title={t("labInfo.title")}>
      <FormField id="name" label={t("labInfo.fields.name")} error={errors.name?.message}>
        <Input id="name" dir="auto" {...register("name")} />
      </FormField>
      <FormField id="tagline" label={t("labInfo.fields.tagline")} error={errors.tagline?.message}>
        <Input id="tagline" dir="auto" {...register("tagline")} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,12rem)_1fr]">
        <FormField id="logo" label={t("labInfo.fields.logo")}>
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <ImageField id="logo" value={field.value} onChange={field.onChange} aspectClassName="aspect-square" />
            )}
          />
        </FormField>
        <FormField id="hero" label={t("labInfo.fields.hero")}>
          <Controller
            control={control}
            name="hero"
            render={({ field }) => <ImageField id="hero" value={field.value} onChange={field.onChange} />}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
