import { AppError } from '../../shared/errors/AppError';
import { recordAudit } from '../../shared/utils/audit';
import type { IPublicationRepository } from './publications.repository';
import { toPublicationDto, type PublicationDto } from './publications.mapper';
import type { PublicationInputDto } from './publications.schema';

export class PublicationService {
  constructor(private readonly repository: IPublicationRepository) {}

  async listPublished(): Promise<PublicationDto[]> {
    const publications = await this.repository.findAll(true);
    return publications.map((p) => toPublicationDto(p, true));
  }

  async listAll(): Promise<PublicationDto[]> {
    const publications = await this.repository.findAll(false);
    return publications.map((p) => toPublicationDto(p, false));
  }

  async getById(id: number): Promise<PublicationDto> {
    const publication = await this.repository.findById(id);
    if (!publication) throw new AppError('Publication not found', 404);
    return toPublicationDto(publication, false);
  }

  async create(userId: number, dto: PublicationInputDto): Promise<PublicationDto> {
    const publication = await this.repository.create(dto);
    await recordAudit(userId, 'CREATE', 'Publication', publication.id, { title: publication.title });
    return toPublicationDto(publication, false);
  }

  async update(userId: number, id: number, dto: PublicationInputDto): Promise<PublicationDto> {
    await this.getById(id);
    const publication = await this.repository.update(id, dto);
    await recordAudit(userId, 'UPDATE', 'Publication', id, { title: publication.title });
    return toPublicationDto(publication, false);
  }

  async remove(userId: number, id: number): Promise<void> {
    const publication = await this.getById(id);
    await this.repository.delete(id);
    await recordAudit(userId, 'DELETE', 'Publication', id, { title: publication.title });
  }
}
