import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import type { IContact } from "@/common/types/Phone";
import { Input } from "@/components/ui/input";
import { ChoiceButton } from "../../components/ChoiceButton";
import { ContactAvatar } from "./ContactAvatar";
import { PhoneHeader } from "./PhoneHeader";

interface ContactsListProps {
  contacts: IContact[];
  query: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function ContactsList({ contacts, query, onQueryChange, onSelect, onBack }: ContactsListProps) {
  const { t } = useTranslation();

  return (
    <>
      <PhoneHeader title={t("demos.coffe.apps.contacts")} onBack={onBack} />
      <div className="relative mx-6 mt-4 mb-2">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={onQueryChange}
          placeholder={t("demos.coffe.search")}
          aria-label={t("demos.coffe.search")}
          className="h-12 bg-background ps-11 text-lg md:text-lg"
        />
      </div>
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto px-6 pb-4">
        {contacts.map((contact) => (
          <li key={contact.id}>
            <ChoiceButton
              value={contact.id}
              onSelect={onSelect}
              className="flex h-16 w-full items-center gap-4 px-4 text-start hover:border-emerald-500"
            >
              <ContactAvatar name={t(contact.nameKey)} className="size-10 text-lg" />
              {t(contact.nameKey)}
            </ChoiceButton>
          </li>
        ))}
        {contacts.length === 0 && <li className="py-8 text-center text-lg text-muted-foreground">{t("demos.coffe.noResults")}</li>}
      </ul>
    </>
  );
}
