import { useTranslation } from "react-i18next";
import { BookUser, Camera, Image, MessageCircle, Phone, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IPhoneApp {
  id: string;
  icon: LucideIcon;
  color: string;
  /** Apps that lead to the contacts; the rest are on-screen distractors. */
  opensContacts: boolean;
}

const APPS: IPhoneApp[] = [
  { id: "messages", icon: MessageCircle, color: "bg-sky-500", opensContacts: false },
  { id: "camera", icon: Camera, color: "bg-zinc-600", opensContacts: false },
  { id: "contacts", icon: BookUser, color: "bg-orange-500", opensContacts: true },
  { id: "gallery", icon: Image, color: "bg-pink-500", opensContacts: false },
  { id: "phone", icon: Phone, color: "bg-emerald-500", opensContacts: true },
  { id: "settings", icon: Settings, color: "bg-slate-500", opensContacts: false },
];

export function PhoneHome({ onOpenContacts }: { onOpenContacts: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="grid flex-1 grid-cols-3 content-center justify-items-center gap-y-10 p-8">
      {APPS.map((app) => (
        <button
          key={app.id}
          type="button"
          onClick={app.opensContacts ? onOpenContacts : undefined}
          className="flex flex-col items-center gap-2 transition active:scale-95"
        >
          <span className={cn("flex size-20 items-center justify-center rounded-2xl text-white shadow", app.color)}>
            <app.icon className="size-10" />
          </span>
          <span className="text-lg font-medium">{t(`demos.coffe.apps.${app.id}`)}</span>
        </button>
      ))}
    </div>
  );
}
