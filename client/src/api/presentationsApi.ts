import api from "@/lib/axios";
import type { ILabDeckInput } from "@/common/types/Presentation";
import { downloadBlob, filenameFromDisposition } from "@/common/utils/downloadBlob";

async function saveResponse(request: Promise<{ data: Blob; headers: Record<string, unknown> }>, fallback: string) {
  const { data, headers } = await request;
  const disposition = headers["content-disposition"];
  downloadBlob(data, filenameFromDisposition(typeof disposition === "string" ? disposition : undefined, fallback));
}

export const presentationsApi = {
  async downloadProjectDeck(projectId: number): Promise<void> {
    await saveResponse(
      api.get<Blob>(`/admin/presentations/projects/${projectId}`, { responseType: "blob" }),
      "project.pptx",
    );
  },

  async downloadLabDeck(input: ILabDeckInput): Promise<void> {
    await saveResponse(api.post<Blob>("/admin/presentations/lab", input, { responseType: "blob" }), "lab.pptx");
  },
};
