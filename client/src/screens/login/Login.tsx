import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <img src="/app_logo.png" alt="" className="mx-auto mb-2 size-12" />
          <CardTitle>{login.challenge ? t("login.otpTitle") : t("login.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {login.errorKey && (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t(login.errorKey)}
            </p>
          )}
          {login.challenge ? (
            <OtpForm
              email={login.challenge.email}
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
