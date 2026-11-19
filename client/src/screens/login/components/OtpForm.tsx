import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface OtpFormProps {
  code: string;
  isVerifying: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onStartOver: () => void;
}

const SLOT_GROUPS = [
  [0, 1, 2],
  [3, 4, 5],
];

const SLOT_CLASS =
  "size-12 rounded-lg border-2 border-foreground/15 bg-background/70 text-xl font-semibold shadow-sm first:rounded-lg first:border-2 last:rounded-lg data-[active=true]:border-primary data-[active=true]:ring-primary/25 sm:size-14 sm:text-2xl";

export function OtpForm({ code, isVerifying, onCodeChange, onSubmit, onStartOver }: OtpFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-center" dir="ltr">
        <InputOTP maxLength={6} value={code} onChange={onCodeChange} autoFocus disabled={isVerifying}>
          {SLOT_GROUPS.map((group, groupIndex) => (
            <div key={group[0]} className="contents">
              {groupIndex > 0 && <InputOTPSeparator className="text-muted-foreground" />}
              <InputOTPGroup className="gap-2">
                {group.map((index) => (
                  <InputOTPSlot key={index} index={index} className={SLOT_CLASS} />
                ))}
              </InputOTPGroup>
            </div>
          ))}
        </InputOTP>
      </div>
      <div className="space-y-2">
        <LoadingButton type="submit" className="h-11 w-full text-base" loading={isVerifying}>
          {t("login.verify")}
        </LoadingButton>
        <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={onStartOver}>
          <ArrowLeft className="rtl:rotate-180" />
          {t("login.useAnotherAccount")}
        </Button>
      </div>
    </form>
  );
}
