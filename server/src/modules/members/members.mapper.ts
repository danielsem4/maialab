import { toMediaDto } from '../../shared/utils/media';
import type { MemberRecord } from './members.repository';

export interface MemberLinksDto {
  website?: string;
  scholar?: string;
  linkedin?: string;
  github?: string;
}

const LINK_KEYS = ['website', 'scholar', 'linkedin', 'github'] as const;

function toLinks(value: unknown): MemberLinksDto {
  const links: MemberLinksDto = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return links;
  const source = value as Record<string, unknown>;
  for (const key of LINK_KEYS) {
    if (typeof source[key] === 'string' && source[key]) links[key] = source[key];
  }
  return links;
}

export function toMemberDto(member: MemberRecord, publicView: boolean) {
  const { photo, projects, links, createdAt: _c, updatedAt: _u, ...rest } = member;
  return {
    ...rest,
    links: toLinks(links),
    photo: toMediaDto(photo),
    projects: projects
      .filter((pm) => !publicView || pm.project.published)
      .sort((a, b) => a.project.sortOrder - b.project.sortOrder)
      .map((pm) => ({ id: pm.project.id, slug: pm.project.slug, title: pm.project.title })),
  };
}

export type MemberDto = ReturnType<typeof toMemberDto>;
