import { recordAudit } from '../../shared/utils/audit';
import { toMediaDto } from '../../shared/utils/media';
import type { ILabInfoRepository, LabInfoRecord } from './lab-info.repository';
import type { LabInfoInputDto } from './lab-info.schema';

function toLabInfoDto(record: LabInfoRecord) {
  const { id: _id, logo, hero, updatedAt: _u, ...rest } = record;
  return { ...rest, logo: toMediaDto(logo), hero: toMediaDto(hero) };
}

export type LabInfoDto = ReturnType<typeof toLabInfoDto>;

export class LabInfoService {
  constructor(private readonly repository: ILabInfoRepository) {}

  /** Returns null until an admin has saved the lab info for the first time. */
  async get(): Promise<LabInfoDto | null> {
    const record = await this.repository.find();
    return record ? toLabInfoDto(record) : null;
  }

  async update(userId: number, dto: LabInfoInputDto): Promise<LabInfoDto> {
    const record = await this.repository.upsert(dto);
    await recordAudit(userId, 'UPDATE', 'LabInfo', record.id);
    return toLabInfoDto(record);
  }
}
