import type { IMedia } from "./Media";

export type MemberCategory = "PI" | "STAFF" | "PHD" | "MSC" | "BSC" | "ALUMNI";

export const MEMBER_CATEGORIES: MemberCategory[] = ["PI", "STAFF", "PHD", "MSC", "BSC", "ALUMNI"];

export interface IMemberLinks {
  website?: string;
  scholar?: string;
  linkedin?: string;
  github?: string;
}

export interface IMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string | null;
  links: IMemberLinks;
  photoMediaId: number | null;
  photo: IMedia | null;
  category: MemberCategory;
  sortOrder: number;
  published: boolean;
  projects: { id: number; slug: string; title: string }[];
}

export interface IMemberInput {
  name: string;
  title: string;
  bio: string;
  email: string | null;
  links: IMemberLinks;
  photoMediaId: number | null;
  category: MemberCategory;
  published: boolean;
}
