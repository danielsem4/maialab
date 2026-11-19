import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useToggle } from "@/hooks/common/useToggle";
import type { CredentialsValues } from "../schema/loginSchema";
import { IconInput } from "./IconInput";

interface CredentialsFormProps {
  form: UseFormReturn<CredentialsValues>;
  isSubmitting: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}

export function CredentialsForm({ form, isSubmitting, onSubmit }: CredentialsFormProps) {
  const { t } = useTranslation();
  const { errors } = form.formState;
  const [showPassword, toggleShowPassword] = useToggle();
  const EyeIcon = showPassword ? EyeOff : Eye;

  const passwordToggle = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 text-primary/80 hover:text-primary"
      aria-label={t(showPassword ? "login.hidePassword" : "login.showPassword")}
      aria-pressed={showPassword}
      onClick={toggleShowPassword}
    >
      <EyeIcon className="size-5" />
    </Button>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField id="email" label={t("login.email")} error={errors.email?.message}>
        <IconInput
          id="email"
          type="email"
          icon={Mail}
          autoComplete="username"
          dir="ltr"
          placeholder={t("login.emailPlaceholder")}
          aria-invalid={!!errors.email}
          {...form.register("email")}
        />
      </FormField>
      <FormField id="password" label={t("login.password")} error={errors.password?.message}>
        <IconInput
          id="password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          autoComplete="current-password"
          dir="ltr"
          placeholder={t("login.passwordPlaceholder")}
          aria-invalid={!!errors.password}
          endAdornment={passwordToggle}
          {...form.register("password")}
        />
      </FormField>
      <LoadingButton type="submit" className="h-11 w-full text-base" loading={isSubmitting}>
        {t("login.submit")}
        <ArrowRight className="rtl:rotate-180" />
      </LoadingButton>
    </form>
  );
}
