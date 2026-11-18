/** Drops the separators people type or read in a phone number (spaces, dashes), keeping digits, `*` and `#`. */
export function normalizeNumber(value: string): string {
  return value.replace(/[\s-]/g, "");
}

/** Groups a number the Israeli mobile way, 3-3-rest ("0522581194" → "052-258-1194"); works on partial input too. */
export function formatPhone(value: string): string {
  const raw = normalizeNumber(value);
  return [raw.slice(0, 3), raw.slice(3, 6), raw.slice(6)].filter(Boolean).join("-");
}

/** True when a non-empty dialed number is exactly the target, ignoring separators. */
export function isSameNumber(dialed: string, target: string): boolean {
  const a = normalizeNumber(dialed);
  return a.length > 0 && a === normalizeNumber(target);
}

/** Items whose translated name contains `query` (case-insensitive), sorted alphabetically in `locale`. */
export function filterContacts<T extends { nameKey: string }>(
  contacts: readonly T[],
  query: string,
  translate: (key: string) => string,
  locale?: string,
): T[] {
  const q = query.trim().toLocaleLowerCase(locale);
  return contacts
    .filter((c) => translate(c.nameKey).toLocaleLowerCase(locale).includes(q))
    .sort((a, b) => translate(a.nameKey).localeCompare(translate(b.nameKey), locale));
}
