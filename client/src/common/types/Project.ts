import type { IMedia } from "./Media";
import type { IPublication } from "./Publication";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "PLANNED";

export const PROJECT_STATUSES: ProjectStatus[] = ["ACTIVE", "COMPLETED", "PLANNED"];

export interface IProjectImage {
  mediaId: number;
  caption: string;
  media: IMedia;
}

export interface IProjectMember {
  memberId: number;
  role: string;
  name: string;
  title: string;
  photo: IMedia | null;
}

export interface IProject {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  startDate: string | null;
  endDate: string | null;
  coverMediaId: number | null;
  cover: IMedia | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  images: IProjectImage[];
  members: IProjectMember[];
  publications: Omit<IPublication, "project" | "pdf">[];
  createdAt: string;
  updatedAt: string;
}

export interface IProjectInput {
  title: string;
  slug?: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  startDate: string | null;
  endDate: string | null;
  coverMediaId: number | null;
  featured: boolean;
  published: boolean;
  images: { mediaId: number; caption: string }[];
  members: { memberId: number; role: string }[];
}
