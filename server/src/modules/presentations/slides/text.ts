const RTL_PATTERN = /[֐-ࣿ]/;

export function isRtl(text: string): boolean {
  return RTL_PATTERN.test(text);
}

/** Direction options for a text box: right-to-left runs are right aligned. */
export function textDir(text: string): { rtlMode?: boolean; align: 'left' | 'right' } {
  return isRtl(text) ? { rtlMode: true, align: 'right' } : { align: 'left' };
}

/** Joins non-empty parts with a separator. */
export function joinParts(parts: Array<string | null | undefined>, separator = ', '): string {
  return parts.filter((p): p is string => Boolean(p && p.trim())).join(separator);
}

/** Splits a list into pages of at most `size` items. */
export function paginate<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

/** Heading for a paginated slide, e.g. "Team (2/3)". */
export function pagedTitle(title: string, index: number, total: number): string {
  return total > 1 ? `${title} (${index + 1}/${total})` : title;
}
