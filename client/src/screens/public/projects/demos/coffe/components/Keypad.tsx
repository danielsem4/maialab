import { useTranslation } from "react-i18next";
import { Delete, Phone } from "lucide-react";
import { formatPhone } from "@/common/utils/phoneUtils";
import { ChoiceButton } from "../../components/ChoiceButton";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

interface KeypadProps {
  value: string;
  onPress: (key: string) => void;
  onBackspace: () => void;
  onCall: () => void;
}

/** Number display with backspace, a 3×4 keypad and a Call button — laid out left-to-right in every language. */
export function Keypad({ value, onPress, onBackspace, onCall }: KeypadProps) {
  const { t } = useTranslation();

  return (
    <div dir="ltr" className="flex flex-col items-center gap-3">
      <div className="flex h-14 w-72 items-center rounded-xl border-2 border-foreground/70 bg-background ps-4 pe-1">
        <output className="min-w-0 flex-1 truncate text-2xl font-medium tracking-wide" aria-label={t("demos.coffe.dialed")}>
          {formatPhone(value)}
        </output>
        <button
          type="button"
          onClick={onBackspace}
          aria-label={t("demos.coffe.backspace")}
          className="flex size-11 items-center justify-center rounded-lg hover:bg-muted"
        >
          <Delete className="size-6" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {KEYS.map((key) => (
          <ChoiceButton key={key} value={key} onSelect={onPress} className="h-14 w-24 rounded-full text-2xl font-semibold">
            {key}
          </ChoiceButton>
        ))}
      </div>
      <button
        type="button"
        onClick={onCall}
        disabled={!value}
        className="flex h-14 items-center gap-3 rounded-xl bg-emerald-500 px-10 text-xl font-semibold text-white shadow transition hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
      >
        {t("demos.coffe.call")}
        <Phone className="size-5" />
      </button>
    </div>
  );
}
