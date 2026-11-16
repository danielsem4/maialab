import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { ImageField } from "@/components/common/ImageField";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import { SwitchField } from "@/components/common/SwitchField";
import { Input } from "@/components/ui/input";
import type { NewsFormValues } from "../schema/newsFormSchema";

interface NewsFormFieldsProps {
  form: UseFormReturn<NewsFormValues>;
}

export function NewsFormFields({ form }: NewsFormFieldsProps) {
  const { t } = useTranslation();
  const { register, control, formState } = form;
  const { errors } = formState;

  return (
    <>
      <FormSection title={t("news.editPost")}>
        <FormField id="title" label={t("news.fields.title")} error={errors.title?.message}>
          <Input id="title" dir="auto" {...register("title")} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
          <FormField id="slug" label={t("news.fields.slug")} hint={t("projects.fields.slugHint")} error={errors.slug?.message}>
            <Input id="slug" dir="ltr" {...register("slug")} />
          </FormField>
          <FormField id="date" label={t("news.fields.date")} error={errors.date?.message}>
            <Input id="date" type="date" {...register("date")} />
          </FormField>
        </div>
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <SwitchField id="published" label={t("news.fields.published")} checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </FormSection>
      <FormSection title={t("news.fields.body")}>
        <FormField id="cover" label={t("news.fields.cover")}>
          <Controller
            control={control}
            name="cover"
            render={({ field }) => <ImageField id="cover" value={field.value} onChange={field.onChange} />}
          />
        </FormField>
        <FormField id="body" label={t("news.fields.body")} error={errors.body?.message}>
          <Controller
            control={control}
            name="body"
            render={({ field }) => <MarkdownEditor id="body" value={field.value} onChange={field.onChange} rows={16} />}
          />
        </FormField>
      </FormSection>
    </>
  );
}
