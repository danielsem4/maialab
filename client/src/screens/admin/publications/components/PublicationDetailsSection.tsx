import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PublicationFormValues } from "../schema/publicationFormSchema";

interface PublicationDetailsSectionProps {
  form: UseFormReturn<PublicationFormValues>;
}

export function PublicationDetailsSection({ form }: PublicationDetailsSectionProps) {
  const { t } = useTranslation();
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <FormSection title={t("publications.editPublication")}>
      <FormField id="title" label={t("publications.fields.title")} error={errors.title?.message}>
        <Input id="title" dir="auto" {...register("title")} />
      </FormField>
      <FormField id="authors" label={t("publications.fields.authors")} error={errors.authors?.message}>
        <Textarea id="authors" rows={2} dir="auto" {...register("authors")} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
        <FormField id="venue" label={t("publications.fields.venue")} error={errors.venue?.message}>
          <Input id="venue" dir="auto" {...register("venue")} />
        </FormField>
        <FormField id="year" label={t("publications.fields.year")} error={errors.year?.message}>
          <Input id="year" type="number" inputMode="numeric" min={1950} max={2100} {...register("year", { valueAsNumber: true })} />
        </FormField>
      </div>
      <FormField id="url" label={t("publications.fields.url")} error={errors.url?.message}>
        <Input id="url" type="url" dir="ltr" placeholder="https://" {...register("url")} />
      </FormField>
    </FormSection>
  );
}
