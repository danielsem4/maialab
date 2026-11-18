import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { formatPhone } from "@/common/utils/phoneUtils";
import { TaskLayout } from "../../components/TaskLayout";
import { Keypad } from "../components/Keypad";
import { PhoneHeader } from "../components/PhoneHeader";
import { PhoneShell } from "../components/PhoneShell";
import { useDialer } from "../hooks/useDialer";
import { DIRECTORY } from "../phoneData";

/** Scenario 2: find the requested number in the list and dial it on the keypad. */
export function DialNumberTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const dialer = useDialer(onComplete);

  return (
    <TaskLayout instruction={t("demos.coffe.tasks.dial.instruction", { label: t(dialer.target.labelKey) })}>
      <PhoneShell>
        <PhoneHeader title={t("demos.coffe.apps.phone")} />
        <div className="grid flex-1 grid-cols-2 items-center gap-4 px-6 py-4">
          <ul className="space-y-1.5 text-lg">
            {DIRECTORY.map((entry) => (
              <li key={entry.id} className="flex justify-between gap-3 rounded-lg px-2 py-0.5">
                <span>{t(entry.labelKey)}:</span>
                <span dir="ltr" className="font-medium tabular-nums">
                  {formatPhone(entry.phone)}
                </span>
              </li>
            ))}
          </ul>
          <Keypad value={dialer.digits} onPress={dialer.press} onBackspace={dialer.backspace} onCall={dialer.call} />
        </div>
      </PhoneShell>
    </TaskLayout>
  );
}
