import type { IContact, IDirectoryEntry } from "@/common/types/Phone";

const C = "demos.coffe.contacts";
const D = "demos.coffe.directory";

function contact(id: string, phone: string): IContact {
  return { id, nameKey: `${C}.${id}`, phone };
}

function entry(id: string, phone: string): IDirectoryEntry {
  return { id, labelKey: `${D}.${id}`, phone };
}

/** Includes look-alikes of the target (same first name, same surname) so the patient has to read carefully. */
export const CONTACTS: IContact[] = [
  contact("danaLevi", "050-412-7788"),
  contact("danLevi", "054-339-1020"),
  contact("danaCohen", "052-871-4456"),
  contact("aviMizrahi", "053-220-9917"),
  contact("ellaPeretz", "050-664-3082"),
  contact("michaelBiton", "054-905-1173"),
  contact("noaFriedman", "052-317-6620"),
  contact("ronShapiro", "058-442-0391"),
  contact("saraKatz", "050-781-2264"),
  contact("yossiAzoulay", "054-150-8836"),
];

export const TARGET_CONTACT_ID = "danaLevi";

/** The numbers listed above the keypad in the real test. */
export const DIRECTORY: IDirectoryEntry[] = [
  entry("psychiatrist", "054-187-2399"),
  entry("familyDoctor", "054-228-6972"),
  entry("ophthalmologist", "052-246-7628"),
  entry("dermatologist", "052-260-1048"),
  entry("dentist", "052-258-1194"),
  entry("orthopedist", "053-128-8891"),
  entry("neurologist", "050-001-6390"),
];

export const TARGET_DIRECTORY_ID = "dentist";

export const CONTACTS_BY_ID: Record<string, IContact> = Object.fromEntries(CONTACTS.map((c) => [c.id, c]));
