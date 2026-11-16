import type { IMedia } from "./Media";

export interface INewsPost {
  id: number;
  slug: string;
  title: string;
  body: string;
  date: string;
  coverMediaId: number | null;
  cover: IMedia | null;
  published: boolean;
}

export interface INewsPostInput {
  title: string;
  slug?: string;
  body: string;
  date: string;
  coverMediaId: number | null;
  published: boolean;
}
