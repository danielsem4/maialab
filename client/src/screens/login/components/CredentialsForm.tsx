import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import type { CredentialsValues } from "../schema/loginSchema";

interface CredentialsFormProps {
  form: UseFormReturn<CredentialsValues>;
  isSubmitting: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}

export function CredentialsForm({ form, isSubmitting, onSubmit }: CredentialsFormProps) {
  const { t } = useTranslation();
  const { errors } = form.formState;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormField id="email" label={t("login.email")} error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="username" dir="ltr" {...form.register("email")} />
      </FormField>
      <FormField id="password" label={t("login.password")} error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" dir="ltr" {...form.register("password")} />
      </FormField>
      <LoadingButton type="submit" className="w-full" loading={isSubmitting}>
        {t("login.submit")}
      </LoadingButton>
    </form>
  );
}
