import { useTranslation } from "react-i18next";
import { PhoneOff } from "lucide-react";
import { ContactAvatar } from "./ContactAvatar";

interface CallingScreenProps {
  name: string;
  onHangUp: () => void;
}

/** The outgoing-call screen; hanging up ends the task. */
export function CallingScreen({ name, onHangUp }: CallingScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-slate-800 text-white">
      <ContactAvatar name={name} className="size-28 animate-pulse text-5xl" />
      <p className="font-display text-3xl font-bold">{name}</p>
      <p className="text-xl text-white/70">{t("demos.coffe.calling")}</p>
      <button
        type="button"
        onClick={onHangUp}
        aria-label={t("demos.coffe.hangUp")}
        className="mt-6 flex size-20 items-center justify-center rounded-full bg-red-500 shadow-lg transition hover:bg-red-600 active:scale-95"
      >
        <PhoneOff className="size-9" />
      </button>
      <p className="text-base text-white/70">{t("demos.coffe.hangUpHint")}</p>
    </div>
  );
}
