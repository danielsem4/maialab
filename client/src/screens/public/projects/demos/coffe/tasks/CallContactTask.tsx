import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { TaskLayout } from "../../components/TaskLayout";
import { CallingScreen } from "../components/CallingScreen";
import { ContactCard } from "../components/ContactCard";
import { ContactsList } from "../components/ContactsList";
import { PhoneHome } from "../components/PhoneHome";
import { PhoneShell } from "../components/PhoneShell";
import { usePhoneNavigation } from "../hooks/usePhoneNavigation";
import { CONTACTS_BY_ID, TARGET_CONTACT_ID } from "../phoneData";

/** Scenario 1: find the requested person in the contacts and call them. */
export function CallContactTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const phone = usePhoneNavigation(onComplete);
  const target = t(CONTACTS_BY_ID[TARGET_CONTACT_ID].nameKey);

  return (
    <TaskLayout instruction={t("demos.coffe.tasks.contact.instruction", { name: target })}>
      <PhoneShell>
        {phone.screen === "home" && <PhoneHome onOpenContacts={phone.openContacts} />}
        {phone.screen === "contacts" && (
          <ContactsList
            contacts={phone.contacts}
            query={phone.query}
            onQueryChange={phone.handleQueryChange}
            onSelect={phone.openContact}
            onBack={phone.back}
          />
        )}
        {phone.screen === "contact" && phone.selected && (
          <ContactCard contact={phone.selected} onCall={phone.call} onBack={phone.back} />
        )}
        {phone.screen === "calling" && phone.selected && (
          <CallingScreen name={t(phone.selected.nameKey)} onHangUp={phone.hangUp} />
        )}
      </PhoneShell>
    </TaskLayout>
  );
}
