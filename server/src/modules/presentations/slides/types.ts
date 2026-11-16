/** An image ready to be placed on a slide: a file on disk plus its pixel size. */
export interface DeckImage {
  path: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface DeckLab {
  name: string;
  tagline: string;
  about: string;
  mission: string;
  contactEmail: string;
  website: string;
  address: string;
  logo: DeckImage | null;
}

export interface DeckPerson {
  name: string;
  title: string;
  photo: DeckImage | null;
}

export interface DeckPublication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  url: string | null;
}

export type DeckProjectStatus = 'ACTIVE' | 'COMPLETED' | 'PLANNED';

export interface DeckProject {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: DeckProjectStatus;
  tags: string[];
  startDate: Date | null;
  endDate: Date | null;
  cover: DeckImage | null;
  images: DeckImage[];
  members: DeckPerson[];
  publications: DeckPublication[];
}
