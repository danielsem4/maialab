import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { LabInfoInputDto } from './lab-info.schema';

/** LabInfo is a single row with id 1. */
const LAB_INFO_ID = 1;

const labInfoInclude = { logo: true, hero: true } satisfies Prisma.LabInfoInclude;

export type LabInfoRecord = Prisma.LabInfoGetPayload<{ include: typeof labInfoInclude }>;

export interface ILabInfoRepository {
  find(): Promise<LabInfoRecord | null>;
  upsert(data: LabInfoInputDto): Promise<LabInfoRecord>;
}

export class LabInfoRepository implements ILabInfoRepository {
  async find(): Promise<LabInfoRecord | null> {
    return prisma.labInfo.findUnique({ where: { id: LAB_INFO_ID }, include: labInfoInclude });
  }

  async upsert(data: LabInfoInputDto): Promise<LabInfoRecord> {
    return prisma.labInfo.upsert({
      where: { id: LAB_INFO_ID },
      create: { id: LAB_INFO_ID, ...data },
      update: data,
      include: labInfoInclude,
    });
  }
}
