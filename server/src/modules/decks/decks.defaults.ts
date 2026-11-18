import { randomUUID } from 'crypto';
import type { DeckDoc } from './decks.schema';

export function emptyDeckDoc(): DeckDoc {
  return {
    version: 1,
    theme: {
      colors: {
        background: '#ffffff',
        surface: '#f1f5f9',
        text: '#0f172a',
        muted: '#64748b',
        accent: '#2563eb',
      },
      fontHeading: 'Inter',
      fontBody: 'Inter',
    },
    slides: [{ id: randomUUID(), transition: 'none', elements: [] }],
  };
}
