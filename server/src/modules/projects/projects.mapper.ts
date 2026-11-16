import { toMediaDto } from '../../shared/utils/media';
import type { ProjectRecord } from './projects.repository';

export function toProjectDto(project: ProjectRecord, publicView: boolean) {
  const { cover, images, members, publications, ...rest } = project;
  return {
    ...rest,
    cover: toMediaDto(cover),
    images: images.map((img) => ({ mediaId: img.mediaId, caption: img.caption, media: toMediaDto(img.media) })),
    members: members
      .filter((pm) => !publicView || pm.member.published)
      .map((pm) => ({
        memberId: pm.memberId,
        role: pm.role,
        name: pm.member.name,
        title: pm.member.title,
        photo: toMediaDto(pm.member.photo),
      })),
    publications: publications.filter((p) => !publicView || p.published),
  };
}

export type ProjectDto = ReturnType<typeof toProjectDto>;
