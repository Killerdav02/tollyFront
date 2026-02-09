import apiClient from "../api/apiClient";
import type { ToolStatus } from "./types";

export async function listToolStatuses(): Promise<ToolStatus[]> {
  const response = await apiClient.get<ToolStatus[]>("/tool-statuses");
  return response.data;
}

