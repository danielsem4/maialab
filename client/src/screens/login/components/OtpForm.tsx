import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface OtpFormProps {
  email: string;
  code: string;
  isVerifying: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onStartOver: () => void;
}

const SLOTS = [0, 1, 2, 3, 4, 5];

export function OtpForm({ email, code, isVerifying, onCodeChange, onSubmit, onStartOver }: OtpFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="text-center text-sm text-muted-foreground">{t("login.otpDescription", { email })}</p>
      <div className="flex justify-center" dir="ltr">
        <InputOTP maxLength={6} value={code} onChange={onCodeChange} autoFocus disabled={isVerifying}>
          <InputOTPGroup>
            {SLOTS.map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <LoadingButton type="submit" className="w-full" loading={isVerifying}>
        {t("login.verify")}
      </LoadingButton>
      <Button type="button" variant="link" className="w-full" onClick={onStartOver}>
        {t("login.useAnotherAccount")}
      </Button>
    </form>
  );
}
