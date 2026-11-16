import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { MemberInputDto } from './members.schema';

export const memberInclude = {
  photo: true,
  projects: {
    include: { project: { select: { id: true, slug: true, title: true, published: true, sortOrder: true } } },
  },
} satisfies Prisma.MemberInclude;

export type MemberRecord = Prisma.MemberGetPayload<{ include: typeof memberInclude }>;

export interface IMemberRepository {
  findAll(publishedOnly: boolean): Promise<MemberRecord[]>;
  findById(id: number): Promise<MemberRecord | null>;
  create(dto: MemberInputDto): Promise<MemberRecord>;
  update(id: number, dto: MemberInputDto): Promise<MemberRecord>;
  delete(id: number): Promise<void>;
  reorder(ids: number[]): Promise<void>;
}

function toData(dto: MemberInputDto) {
  return { ...dto, links: dto.links as Prisma.InputJsonObject };
}

export class MemberRepository implements IMemberRepository {
  async findAll(publishedOnly: boolean): Promise<MemberRecord[]> {
    return prisma.member.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: memberInclude,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findById(id: number): Promise<MemberRecord | null> {
    return prisma.member.findUnique({ where: { id }, include: memberInclude });
  }

  async create(dto: MemberInputDto): Promise<MemberRecord> {
    const last = await prisma.member.aggregate({ _max: { sortOrder: true } });
    return prisma.member.create({
      data: { ...toData(dto), sortOrder: (last._max.sortOrder ?? -1) + 1 },
      include: memberInclude,
    });
  }

  async update(id: number, dto: MemberInputDto): Promise<MemberRecord> {
    return prisma.member.update({ where: { id }, data: toData(dto), include: memberInclude });
  }

  async delete(id: number): Promise<void> {
    await prisma.member.delete({ where: { id } });
  }

  async reorder(ids: number[]): Promise<void> {
    await prisma.$transaction(
      ids.map((id, index) => prisma.member.update({ where: { id }, data: { sortOrder: index } })),
    );
  }
}
