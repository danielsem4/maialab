import api from "@/lib/axios";
import type { IDashboard } from "@/common/types/Dashboard";

export const dashboardApi = {
  async get(): Promise<IDashboard> {
    const { data } = await api.get<IDashboard>("/admin/dashboard");
    return data;
  },
};
