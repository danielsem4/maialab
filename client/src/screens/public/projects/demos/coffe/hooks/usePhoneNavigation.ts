import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import type { PhoneScreen } from "@/common/types/Phone";
import { filterContacts } from "@/common/utils/phoneUtils";
import { CONTACTS, CONTACTS_BY_ID, TARGET_CONTACT_ID } from "../phoneData";

/** Home screen → contacts → contact card → calling. Hanging up ends the task: passed if the right person was called. */
export function usePhoneNavigation(onComplete: (passed: boolean) => void) {
  const { t, i18n } = useTranslation();
  const [screen, setScreen] = useState<PhoneScreen>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  function openContacts() {
    setScreen("contacts");
  }

  function openContact(id: string) {
    setSelectedId(id);
    setScreen("contact");
  }

  function call() {
    setScreen("calling");
  }

  function hangUp() {
    onComplete(selectedId === TARGET_CONTACT_ID);
  }

  function back() {
    setScreen((current) => (current === "contact" ? "contacts" : "home"));
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  return {
    screen,
    query,
    contacts: filterContacts(CONTACTS, query, t, i18n.language),
    selected: selectedId ? CONTACTS_BY_ID[selectedId] : undefined,
    openContacts,
    openContact,
    call,
    hangUp,
    back,
    handleQueryChange,
  };
}
