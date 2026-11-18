import api from "@/lib/axios";
import type { IDeck, IDeckDoc, IDeckSummary } from "@/common/types/Deck";

export interface IDeckUpdate {
  /** The updatedAt this client last saw; the server answers 409 when it is stale. */
  updatedAt: string;
  title?: string;
  doc?: IDeckDoc;
  isTemplate?: boolean;
}

export const decksApi = {
  async list(): Promise<IDeckSummary[]> {
    const { data } = await api.get<{ decks: IDeckSummary[] }>("/admin/decks");
    return data.decks;
  },

  async get(id: number): Promise<IDeck> {
    const { data } = await api.get<{ deck: IDeck }>(`/admin/decks/${id}`);
    return data.deck;
  },

  async create(input: { title: string; templateId?: number }): Promise<IDeck> {
    const { data } = await api.post<{ deck: IDeck }>("/admin/decks", input);
    return data.deck;
  },

  async update(id: number, input: IDeckUpdate): Promise<IDeck> {
    const { data } = await api.patch<{ deck: IDeck }>(`/admin/decks/${id}`, input);
    return data.deck;
  },

  async duplicate(id: number): Promise<IDeck> {
    const { data } = await api.post<{ deck: IDeck }>(`/admin/decks/${id}/duplicate`);
    return data.deck;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/decks/${id}`);
  },
};
