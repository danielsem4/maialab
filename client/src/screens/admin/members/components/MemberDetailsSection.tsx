import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MEMBER_CATEGORIES } from "@/common/types/Member";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { SwitchField } from "@/components/common/SwitchField";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MemberFormValues } from "../schema/memberFormSchema";

interface MemberDetailsSectionProps {
  form: UseFormReturn<MemberFormValues>;
}

export function MemberDetailsSection({ form }: MemberDetailsSectionProps) {
  const { t } = useTranslation();
  const { register, control, formState } = form;
  const { errors } = formState;

  return (
    <FormSection title={t("members.editMember")}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="name" label={t("members.fields.name")} error={errors.name?.message}>
          <Input id="name" dir="auto" {...register("name")} />
        </FormField>
        <FormField id="title" label={t("members.fields.title")} error={errors.title?.message}>
          <Input id="title" dir="auto" {...register("title")} />
        </FormField>
        <FormField id="category" label={t("members.fields.category")}>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(`members.category.${category}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField id="email" label={t("members.fields.email")} error={errors.email?.message}>
          <Input id="email" type="email" dir="ltr" {...register("email")} />
        </FormField>
      </div>
      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <SwitchField id="published" label={t("members.fields.published")} checked={field.value} onCheckedChange={field.onChange} />
        )}
      />
    </FormSection>
  );
}
