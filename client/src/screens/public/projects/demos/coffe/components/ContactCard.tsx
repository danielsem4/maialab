import { useTranslation } from "react-i18next";
import { Phone } from "lucide-react";
import type { IContact } from "@/common/types/Phone";
import { formatPhone } from "@/common/utils/phoneUtils";
import { ContactAvatar } from "./ContactAvatar";
import { PhoneHeader } from "./PhoneHeader";

interface ContactCardProps {
  contact: IContact;
  onCall: () => void;
  onBack: () => void;
}

export function ContactCard({ contact, onCall, onBack }: ContactCardProps) {
  const { t } = useTranslation();
  const name = t(contact.nameKey);

  return (
    <>
      <PhoneHeader title={t("demos.coffe.apps.contacts")} onBack={onBack} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <ContactAvatar name={name} className="size-28 text-5xl" />
        <p className="font-display text-3xl font-bold">{name}</p>
        <p className="text-2xl text-muted-foreground" dir="ltr">
          {formatPhone(contact.phone)}
        </p>
        <button
          type="button"
          onClick={onCall}
          className="mt-4 flex h-16 items-center gap-3 rounded-full bg-emerald-500 px-12 text-xl font-semibold text-white shadow transition hover:bg-emerald-600 active:scale-95"
        >
          <Phone className="size-6" />
          {t("demos.coffe.call")}
        </button>
      </div>
    </>
  );
}
