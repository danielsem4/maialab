/** Adds the item when missing, removes it when present — a multi-select tap. */
export function toggleInList<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((other) => other !== item) : [...list, item];
}
