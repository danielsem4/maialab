import { useTranslation } from "react-i18next";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Placeholder — the login flow (password + OTP) is defined later.
export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <img src="/app_logo.png" alt="" className="h-12 w-12 mb-2" />
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription>{t("common.comingSoon")}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
