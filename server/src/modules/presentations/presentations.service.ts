import { AppError } from '../../shared/errors/AppError';
import { recordAudit } from '../../shared/utils/audit';
import { slugify } from '../../shared/utils/slug';
import { toDeckLab, toDeckPerson, toDeckProject } from './presentations.mapper';
import type { IPresentationRepository } from './presentations.repository';
import type { LabDeckDto } from './presentations.schema';
import { buildLabDeck, buildProjectDeck } from './slides/buildDeck';

export interface DeckFile {
  buffer: Buffer;
  /** File name without extension. May contain non-ASCII characters. */
  name: string;
}

export class PresentationService {
  constructor(private readonly repository: IPresentationRepository) {}

  /** Builds a single-project deck. Works for draft projects too. */
  async buildProjectDeck(projectId: number): Promise<DeckFile> {
    const [labInfo, projects] = await Promise.all([
      this.repository.findLabInfo(),
      this.repository.findProjectsByIds([projectId]),
    ]);
    const project = projects[0];
    if (!project) throw new AppError('Project not found', 404);

    const buffer = await buildProjectDeck(toDeckLab(labInfo), toDeckProject(project));
    return { buffer, name: project.slug || slugify(project.title) || 'project' };
  }

  /** Builds the lab overview deck with the projects in the order given. */
  async buildLabDeck(dto: LabDeckDto): Promise<DeckFile> {
    const ids = [...new Set(dto.projectIds)];
    const [labInfo, records, members] = await Promise.all([
      this.repository.findLabInfo(),
      this.repository.findProjectsByIds(ids),
      dto.includeTeam ? this.repository.findPublishedMembers() : Promise.resolve([]),
    ]);

    const byId = new Map(records.map((p) => [p.id, p]));
    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length > 0) throw new AppError(`Projects not found: ${missing.join(', ')}`, 404);

    const projects = ids.map((id) => toDeckProject(byId.get(id)!));
    const lab = toDeckLab(labInfo);
    const buffer = await buildLabDeck({
      lab,
      projects,
      team: dto.includeTeam ? members.map((m) => toDeckPerson(m)) : null,
      publications: dto.includePublications ? projects.flatMap((p) => p.publications) : null,
    });
    return { buffer, name: lab.name };
  }

  async exportProjectDeck(userId: number, projectId: number): Promise<DeckFile> {
    const deck = await this.buildProjectDeck(projectId);
    await recordAudit(userId, 'EXPORT', 'Presentation', projectId, { kind: 'project', name: deck.name });
    return deck;
  }

  async exportLabDeck(userId: number, dto: LabDeckDto): Promise<DeckFile> {
    const deck = await this.buildLabDeck(dto);
    await recordAudit(userId, 'EXPORT', 'Presentation', 0, { kind: 'lab', ...dto });
    return deck;
  }
}
