import api from "@/lib/axios";
import type { ILabInfo, ILabInfoInput } from "@/common/types/LabInfo";

export const labInfoApi = {
  async get(): Promise<ILabInfo | null> {
    const { data } = await api.get<{ labInfo: ILabInfo | null }>("/lab-info");
    return data.labInfo;
  },

  async update(input: ILabInfoInput): Promise<ILabInfo> {
    const { data } = await api.put<{ labInfo: ILabInfo }>("/admin/lab-info", input);
    return data.labInfo;
  },
};
