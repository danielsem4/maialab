import type { DeckProjectStatus } from './types';

/** Fixed deck wording. Decks are exported in English; lab content keeps its own language. */
export const LABELS = {
  about: 'About the lab',
  projects: 'Projects',
  team: 'Team',
  projectTeam: 'Project team',
  publications: 'Publications',
  gallery: 'Gallery',
  overview: 'Overview',
  thanks: 'Thank you',
  present: 'present',
  labOverview: 'Lab overview',
  status: {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    PLANNED: 'Planned',
  } satisfies Record<DeckProjectStatus, string>,
} as const;

const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "Mar 2023 – present", "2021 – 2024"-style period text, or '' when no dates are set. */
export function formatPeriod(start: Date | null, end: Date | null): string {
  if (!start && !end) return '';
  const from = start ? monthYear.format(start) : '';
  const to = end ? monthYear.format(end) : LABELS.present;
  return from ? `${from} – ${to}` : to;
}
