import { AppError } from '../../shared/errors/AppError';
import { recordAudit } from '../../shared/utils/audit';
import { slugify } from '../../shared/utils/slug';
import type { IProjectRepository } from './projects.repository';
import { toProjectDto, type ProjectDto } from './projects.mapper';
import type { ProjectInputDto } from './projects.schema';

export class ProjectService {
  constructor(private readonly repository: IProjectRepository) {}

  async listPublished(): Promise<ProjectDto[]> {
    const projects = await this.repository.findAll(true);
    return projects.map((p) => toProjectDto(p, true));
  }

  async getPublishedBySlug(slug: string): Promise<ProjectDto> {
    const project = await this.repository.findBySlug(slug, true);
    if (!project) throw new AppError('Project not found', 404);
    return toProjectDto(project, true);
  }

  async listAll(): Promise<ProjectDto[]> {
    const projects = await this.repository.findAll(false);
    return projects.map((p) => toProjectDto(p, false));
  }

  async getById(id: number): Promise<ProjectDto> {
    const project = await this.repository.findById(id);
    if (!project) throw new AppError('Project not found', 404);
    return toProjectDto(project, false);
  }

  async create(userId: number, dto: ProjectInputDto): Promise<ProjectDto> {
    await this.assertMedia(dto);
    const slug = await this.resolveSlug(dto);
    const { images: _i, members: _m, ...data } = dto;
    const project = await this.repository.create({ ...data, slug }, dto);
    await recordAudit(userId, 'CREATE', 'Project', project.id, { title: project.title });
    return toProjectDto(project, false);
  }

  async update(userId: number, id: number, dto: ProjectInputDto): Promise<ProjectDto> {
    await this.getById(id);
    await this.assertMedia(dto);
    const slug = await this.resolveSlug(dto, id);
    const { images: _i, members: _m, ...data } = dto;
    const project = await this.repository.update(id, { ...data, slug }, dto);
    await recordAudit(userId, 'UPDATE', 'Project', id, { title: project.title });
    return toProjectDto(project, false);
  }

  async remove(userId: number, id: number): Promise<void> {
    const project = await this.getById(id);
    await this.repository.delete(id);
    await recordAudit(userId, 'DELETE', 'Project', id, { title: project.title });
  }

  async reorder(userId: number, ids: number[]): Promise<void> {
    await this.repository.reorder(ids);
    await recordAudit(userId, 'REORDER', 'Project', 0, { ids });
  }

  /** The cover must be an image; the gallery takes images and videos (not PDFs or other files). */
  private async assertMedia(dto: ProjectInputDto): Promise<void> {
    const galleryIds = dto.images.map((image) => image.mediaId);
    const types = await this.repository.findMediaTypes([...galleryIds, ...(dto.coverMediaId ? [dto.coverMediaId] : [])]);

    if (dto.coverMediaId && !types.get(dto.coverMediaId)?.startsWith('image/')) {
      throw new AppError('The cover must be an image', 400);
    }
    for (const id of galleryIds) {
      const type = types.get(id) ?? '';
      if (!type.startsWith('image/') && !type.startsWith('video/')) {
        throw new AppError('The gallery can only contain images and videos', 400);
      }
    }
  }

  private async resolveSlug(dto: ProjectInputDto, excludeId?: number): Promise<string> {
    const slug = dto.slug || slugify(dto.title);
    if (!slug) throw new AppError('A URL slug could not be generated from the title', 400);
    if (await this.repository.slugExists(slug, excludeId)) {
      throw new AppError('Another project already uses this URL slug', 409);
    }
    return slug;
  }
}
