import type { IMedia } from "./Media";

export interface ISocialLinks {
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface ILabInfo {
  name: string;
  tagline: string;
  about: string;
  mission: string;
  contactEmail: string;
  address: string;
  mapUrl: string;
  socialLinks: ISocialLinks;
  logoMediaId: number | null;
  logo: IMedia | null;
  heroMediaId: number | null;
  hero: IMedia | null;
}

export type ILabInfoInput = Omit<ILabInfo, "logo" | "hero">;
