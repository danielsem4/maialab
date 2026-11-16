import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

export const labInfoInclude = { logo: true, hero: true } satisfies Prisma.LabInfoInclude;

export const deckProjectInclude = {
  cover: true,
  images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
  members: {
    include: { member: { include: { photo: true } } },
    orderBy: [{ member: { sortOrder: 'asc' } }, { member: { name: 'asc' } }],
  },
  publications: { where: { published: true }, orderBy: [{ year: 'desc' }, { title: 'asc' }] },
} satisfies Prisma.ProjectInclude;

export type LabInfoRecord = Prisma.LabInfoGetPayload<{ include: typeof labInfoInclude }>;
export type DeckProjectRecord = Prisma.ProjectGetPayload<{ include: typeof deckProjectInclude }>;
export type DeckMemberRecord = Prisma.MemberGetPayload<{ include: { photo: true } }>;

export interface IPresentationRepository {
  findLabInfo(): Promise<LabInfoRecord | null>;
  /** Projects with the given ids, in no particular order; missing ids are left out. */
  findProjectsByIds(ids: number[]): Promise<DeckProjectRecord[]>;
  findPublishedMembers(): Promise<DeckMemberRecord[]>;
}

export class PresentationRepository implements IPresentationRepository {
  async findLabInfo(): Promise<LabInfoRecord | null> {
    return prisma.labInfo.findUnique({ where: { id: 1 }, include: labInfoInclude });
  }

  async findProjectsByIds(ids: number[]): Promise<DeckProjectRecord[]> {
    return prisma.project.findMany({ where: { id: { in: ids } }, include: deckProjectInclude });
  }

  async findPublishedMembers(): Promise<DeckMemberRecord[]> {
    return prisma.member.findMany({
      where: { published: true },
      include: { photo: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
  }
}
