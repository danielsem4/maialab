import { toMediaDto } from '../../shared/utils/media';
import type { PublicationRecord } from './publications.repository';

export function toPublicationDto(publication: PublicationRecord, publicView: boolean) {
  const { pdf, project, createdAt: _c, updatedAt: _u, ...rest } = publication;
  const visibleProject = project && (!publicView || project.published) ? project : null;
  return {
    ...rest,
    pdf: toMediaDto(pdf),
    project: visibleProject ? { id: visibleProject.id, slug: visibleProject.slug, title: visibleProject.title } : null,
  };
}

export type PublicationDto = ReturnType<typeof toPublicationDto>;
