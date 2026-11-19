import { Navigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { AlertCircle, MailCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { CredentialsForm } from "./components/CredentialsForm";
import { OtpForm } from "./components/OtpForm";
import { useLogin } from "./hooks/useLogin";

export default function Login() {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.userId);
  const login = useLogin();

  if (userId) return <Navigate to="/admin" replace />;

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md gap-8 py-10 shadow-xl">
        <CardHeader className="items-center gap-3 px-8 text-center sm:px-10">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            {login.challenge ? (
              <MailCheck aria-hidden className="size-8 text-primary" />
            ) : (
              <img src="/app_logo.png" alt="" className="size-10" />
            )}
          </div>
          <CardTitle className="text-2xl">{login.challenge ? t("login.otpTitle") : t("login.title")}</CardTitle>
          <CardDescription className="text-balance">
            {login.challenge ? (
              <Trans
                i18nKey="login.otpDescription"
                values={{ email: login.challenge.email }}
                components={{ email: <span dir="ltr" className="font-medium text-foreground" /> }}
              />
            ) : (
              t("login.subtitle")
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-8 sm:px-10">
          {login.errorKey && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
              {t(login.errorKey)}
            </p>
          )}
          {login.challenge ? (
            <OtpForm
              code={login.code}
              isVerifying={login.isVerifying}
              onCodeChange={login.handleCodeChange}
              onSubmit={login.handleCodeSubmit}
              onStartOver={login.handleStartOver}
            />
          ) : (
            <CredentialsForm
              form={login.form}
              isSubmitting={login.isSubmitting}
              onSubmit={login.handleCredentialsSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
