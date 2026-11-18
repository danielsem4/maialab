import type { Deck, Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { DeckDoc } from './decks.schema';

export type DeckRecord = Deck;

export interface DeckUpdateData {
  title?: string;
  doc?: DeckDoc;
  isTemplate?: boolean;
}

export interface IDeckRepository {
  list(): Promise<DeckRecord[]>;
  findById(id: number): Promise<DeckRecord | null>;
  create(data: { title: string; doc: DeckDoc; createdById: number }): Promise<DeckRecord>;
  /** Updates only if the row's updatedAt still equals `expected`. Returns null when it does not (or the row is gone). */
  updateIfUnchanged(id: number, expected: Date, data: DeckUpdateData): Promise<DeckRecord | null>;
  remove(id: number): Promise<boolean>;
}

function toJson(doc: DeckDoc): Prisma.InputJsonObject {
  return doc as unknown as Prisma.InputJsonObject;
}

export class DeckRepository implements IDeckRepository {
  async list(): Promise<DeckRecord[]> {
    return prisma.deck.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  async findById(id: number): Promise<DeckRecord | null> {
    return prisma.deck.findUnique({ where: { id } });
  }

  async create(data: { title: string; doc: DeckDoc; createdById: number }): Promise<DeckRecord> {
    return prisma.deck.create({ data: { ...data, doc: toJson(data.doc) } });
  }

  async updateIfUnchanged(id: number, expected: Date, data: DeckUpdateData): Promise<DeckRecord | null> {
    const { doc, ...rest } = data;
    const result = await prisma.deck.updateMany({
      where: { id, updatedAt: expected },
      // updateMany does not apply @updatedAt on its own.
      data: { ...rest, ...(doc ? { doc: toJson(doc) } : {}), updatedAt: new Date() },
    });
    if (result.count === 0) return null;
    return this.findById(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await prisma.deck.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
