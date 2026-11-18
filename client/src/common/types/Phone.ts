/** A person in the simulated phone's contacts. `nameKey` is an i18n key. */
export interface IContact {
  id: string;
  nameKey: string;
  phone: string;
}

/** A labelled number in the dialer's directory (family doctor, dentist, …). `labelKey` is an i18n key. */
export interface IDirectoryEntry {
  id: string;
  labelKey: string;
  phone: string;
}

export type PhoneScreen = "home" | "contacts" | "contact" | "calling";
