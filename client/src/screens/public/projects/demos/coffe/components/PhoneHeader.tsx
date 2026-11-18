import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

interface PhoneHeaderProps {
  title: string;
  onBack?: () => void;
}

/** The phone app's green title bar, with an optional back arrow. */
export function PhoneHeader({ title, onBack }: PhoneHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-14 shrink-0 items-center justify-center bg-emerald-500 text-white">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={t("demos.coffe.back")}
          className="absolute start-2 flex size-11 items-center justify-center rounded-full hover:bg-white/15"
        >
          <ArrowLeft className="size-6 rtl:rotate-180" />
        </button>
      )}
      <h3 className="font-display text-2xl font-bold">{title}</h3>
    </div>
  );
}
