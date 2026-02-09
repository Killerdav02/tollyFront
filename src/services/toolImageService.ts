import apiClient from "../api/apiClient";
import type { ToolImage } from "./types";

export async function listToolImages(toolId: number): Promise<ToolImage[]> {
  const response = await apiClient.get<ToolImage[]>(`/tools/${toolId}/images`);
  return response.data;
}

export async function createToolImage(payload: { toolId: number; image_url: string }): Promise<ToolImage> {
  const response = await apiClient.post<ToolImage>("/tool-images", payload);
  return response.data;
}

export async function deleteToolImage(id: number): Promise<void> {
  await apiClient.delete(`/tool-images/${id}`);
}

