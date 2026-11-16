import { toMediaDto } from '../../shared/utils/media';
import type { NewsRecord } from './news.repository';

export function toNewsDto(post: NewsRecord) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    body: post.body,
    date: post.date,
    coverMediaId: post.coverMediaId,
    cover: toMediaDto(post.cover),
    published: post.published,
  };
}

export type NewsDto = ReturnType<typeof toNewsDto>;
