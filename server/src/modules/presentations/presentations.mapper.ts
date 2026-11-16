import fs from 'fs';
import { imageSize } from 'image-size';
import { storage } from '../../shared/storage/localStorage';
import type { DeckImage, DeckLab, DeckPerson, DeckProject } from './slides/types';
import type { DeckMemberRecord, DeckProjectRecord, LabInfoRecord } from './presentations.repository';

/** Formats PowerPoint can embed. WebP and PDFs are left out of decks. */
const SLIDE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif']);

interface MediaLike {
  filename: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  alt: string;
}

function readSize(filePath: string): { width: number; height: number } | null {
  try {
    const { width, height } = imageSize(fs.readFileSync(filePath));
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}

/** Resolves a media row to a file on disk, or null when it can't go on a slide. */
export function toDeckImage(media: MediaLike | null | undefined, caption = ''): DeckImage | null {
  if (!media || !SLIDE_IMAGE_TYPES.has(media.mimeType)) return null;
  const filePath = storage.resolvePath(media.filename);
  if (!fs.existsSync(filePath)) return null;
  const size = media.width && media.height ? { width: media.width, height: media.height } : readSize(filePath);
  if (!size) return null;
  return { path: filePath, ...size, alt: media.alt, caption };
}

function readWebsite(socialLinks: unknown): string {
  if (!socialLinks || typeof socialLinks !== 'object') return '';
  const website = (socialLinks as Record<string, unknown>)['website'];
  return typeof website === 'string' ? website : '';
}

export function toDeckLab(labInfo: LabInfoRecord | null): DeckLab {
  return {
    name: labInfo?.name || 'Lab',
    tagline: labInfo?.tagline ?? '',
    about: labInfo?.about ?? '',
    mission: labInfo?.mission ?? '',
    contactEmail: labInfo?.contactEmail ?? '',
    website: readWebsite(labInfo?.socialLinks),
    address: labInfo?.address ?? '',
    logo: toDeckImage(labInfo?.logo),
  };
}

export function toDeckPerson(member: DeckMemberRecord, role = ''): DeckPerson {
  return { name: member.name, title: role || member.title, photo: toDeckImage(member.photo) };
}

export function toDeckProject(project: DeckProjectRecord): DeckProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    status: project.status,
    tags: project.tags,
    startDate: project.startDate,
    endDate: project.endDate,
    cover: toDeckImage(project.cover),
    images: project.images
      .map((img) => toDeckImage(img.media, img.caption))
      .filter((img): img is DeckImage => img !== null),
    members: project.members.map((pm) => toDeckPerson(pm.member, pm.role)),
    publications: project.publications.map((pub) => ({
      title: pub.title,
      authors: pub.authors,
      venue: pub.venue,
      year: pub.year,
      url: pub.url,
    })),
  };
}
