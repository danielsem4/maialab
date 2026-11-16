import api from "@/lib/axios";
import type { IProject, IProjectInput } from "@/common/types/Project";

export const projectsApi = {
  async listPublished(): Promise<IProject[]> {
    const { data } = await api.get<{ projects: IProject[] }>("/projects");
    return data.projects;
  },

  async getPublished(slug: string): Promise<IProject> {
    const { data } = await api.get<{ project: IProject }>(`/projects/${encodeURIComponent(slug)}`);
    return data.project;
  },

  async listAll(): Promise<IProject[]> {
    const { data } = await api.get<{ projects: IProject[] }>("/admin/projects");
    return data.projects;
  },

  async get(id: number): Promise<IProject> {
    const { data } = await api.get<{ project: IProject }>(`/admin/projects/${id}`);
    return data.project;
  },

  async create(input: IProjectInput): Promise<IProject> {
    const { data } = await api.post<{ project: IProject }>("/admin/projects", input);
    return data.project;
  },

  async update(id: number, input: IProjectInput): Promise<IProject> {
    const { data } = await api.patch<{ project: IProject }>(`/admin/projects/${id}`, input);
    return data.project;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/projects/${id}`);
  },

  async reorder(ids: number[]): Promise<void> {
    await api.patch("/admin/projects/reorder", { ids });
  },
};
