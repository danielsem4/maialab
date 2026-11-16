import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { Input } from "@/components/ui/input";
import { LINK_KEYS, type MemberFormValues } from "../schema/memberFormSchema";

interface MemberLinksSectionProps {
  form: UseFormReturn<MemberFormValues>;
}

export function MemberLinksSection({ form }: MemberLinksSectionProps) {
  const { t } = useTranslation();
  const { register, formState } = form;

  return (
    <FormSection title={t("labInfo.socialLinks")}>
      <div className="grid gap-5 sm:grid-cols-2">
        {LINK_KEYS.map((key) => (
          <FormField
            key={key}
            id={`links-${key}`}
            label={t(`members.fields.${key}`)}
            error={formState.errors.links?.[key]?.message}
          >
            <Input id={`links-${key}`} type="url" dir="ltr" placeholder="https://" {...register(`links.${key}`)} />
          </FormField>
        ))}
      </div>
    </FormSection>
  );
}
