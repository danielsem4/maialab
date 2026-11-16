import type { IMedia } from "./Media";

export interface IPublication {
  id: number;
  title: string;
  authors: string;
  venue: string;
  year: number;
  url: string | null;
  pdfMediaId: number | null;
  pdf: IMedia | null;
  projectId: number | null;
  project: { id: number; slug: string; title: string } | null;
  published: boolean;
}

export interface IPublicationInput {
  title: string;
  authors: string;
  venue: string;
  year: number;
  url: string | null;
  pdfMediaId: number | null;
  projectId: number | null;
  published: boolean;
}
