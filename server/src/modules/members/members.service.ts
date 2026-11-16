import { AppError } from '../../shared/errors/AppError';
import { recordAudit } from '../../shared/utils/audit';
import type { IMemberRepository } from './members.repository';
import { toMemberDto, type MemberDto } from './members.mapper';
import type { MemberInputDto } from './members.schema';

export class MemberService {
  constructor(private readonly repository: IMemberRepository) {}

  async listPublished(): Promise<MemberDto[]> {
    const members = await this.repository.findAll(true);
    return members.map((m) => toMemberDto(m, true));
  }

  async listAll(): Promise<MemberDto[]> {
    const members = await this.repository.findAll(false);
    return members.map((m) => toMemberDto(m, false));
  }

  async getById(id: number): Promise<MemberDto> {
    const member = await this.repository.findById(id);
    if (!member) throw new AppError('Member not found', 404);
    return toMemberDto(member, false);
  }

  async create(userId: number, dto: MemberInputDto): Promise<MemberDto> {
    const member = await this.repository.create(dto);
    await recordAudit(userId, 'CREATE', 'Member', member.id, { name: member.name });
    return toMemberDto(member, false);
  }

  async update(userId: number, id: number, dto: MemberInputDto): Promise<MemberDto> {
    await this.getById(id);
    const member = await this.repository.update(id, dto);
    await recordAudit(userId, 'UPDATE', 'Member', id, { name: member.name });
    return toMemberDto(member, false);
  }

  async remove(userId: number, id: number): Promise<void> {
    const member = await this.getById(id);
    await this.repository.delete(id);
    await recordAudit(userId, 'DELETE', 'Member', id, { name: member.name });
  }

  async reorder(userId: number, ids: number[]): Promise<void> {
    await this.repository.reorder(ids);
    await recordAudit(userId, 'REORDER', 'Member', 0, { ids });
  }
}
