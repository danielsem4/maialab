import { AppError } from '../../shared/errors/AppError';
import { recordAudit } from '../../shared/utils/audit';
import type { DeckRecord, IDeckRepository } from './decks.repository';
import type { CreateDeckDto, DeckDoc, UpdateDeckDto } from './decks.schema';
import { emptyDeckDoc } from './decks.defaults';

export interface DeckSummaryDto {
  id: number;
  title: string;
  isTemplate: boolean;
  slideCount: number;
  updatedAt: string;
}

export interface DeckDto extends DeckSummaryDto {
  doc: DeckDoc;
}

function toDeckSummary(record: DeckRecord): DeckSummaryDto {
  const doc = record.doc as unknown as DeckDoc;
  return {
    id: record.id,
    title: record.title,
    isTemplate: record.isTemplate,
    slideCount: Array.isArray(doc?.slides) ? doc.slides.length : 0,
    updatedAt: record.updatedAt.toISOString(),
  };
}

function toDeck(record: DeckRecord): DeckDto {
  return { ...toDeckSummary(record), doc: record.doc as unknown as DeckDoc };
}

export class DeckService {
  constructor(private readonly repository: IDeckRepository) {}

  async list(): Promise<DeckSummaryDto[]> {
    const decks = await this.repository.list();
    return decks.map(toDeckSummary);
  }

  async get(id: number): Promise<DeckDto> {
    return toDeck(await this.findOrThrow(id));
  }

  async create(userId: number, dto: CreateDeckDto): Promise<DeckDto> {
    let doc = emptyDeckDoc();
    if (dto.templateId !== undefined) {
      const template = await this.repository.findById(dto.templateId);
      if (!template) throw new AppError('Template not found', 404);
      doc = template.doc as unknown as DeckDoc;
    }
    const deck = await this.repository.create({ title: dto.title, doc, createdById: userId });
    await recordAudit(userId, 'CREATE', 'Deck', deck.id, { title: deck.title });
    return toDeck(deck);
  }

  // No audit entry here: autosave would flood the log.
  async update(_userId: number, id: number, dto: UpdateDeckDto): Promise<DeckDto> {
    const { updatedAt, ...data } = dto;
    const deck = await this.repository.updateIfUnchanged(id, new Date(updatedAt), data);
    if (deck) return toDeck(deck);
    await this.findOrThrow(id);
    throw new AppError('Deck was changed elsewhere', 409);
  }

  async duplicate(userId: number, id: number): Promise<DeckDto> {
    const source = await this.findOrThrow(id);
    const deck = await this.repository.create({
      title: `${source.title} (copy)`.slice(0, 200),
      doc: source.doc as unknown as DeckDoc,
      createdById: userId,
    });
    await recordAudit(userId, 'CREATE', 'Deck', deck.id, { title: deck.title, copiedFrom: id });
    return toDeck(deck);
  }

  async remove(userId: number, id: number): Promise<void> {
    const deck = await this.findOrThrow(id);
    await this.repository.remove(id);
    await recordAudit(userId, 'DELETE', 'Deck', id, { title: deck.title });
  }

  private async findOrThrow(id: number): Promise<DeckRecord> {
    const deck = await this.repository.findById(id);
    if (!deck) throw new AppError('Deck not found', 404);
    return deck;
  }
}
