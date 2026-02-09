import apiClient from "../api/apiClient";
import type { Tool } from "./types";

export interface ToolFilters {
  availableOnly?: boolean;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function listTools(filters: ToolFilters = {}): Promise<Tool[]> {
  const response = await apiClient.get<Tool[]>("/tools", { params: filters });
  return response.data;
}

export async function getToolById(id: number): Promise<Tool> {
  const response = await apiClient.get<Tool>(`/tools/${id}`);
  return response.data;
}

export async function createTool(payload: {
  name: string;
  description: string;
  dailyPrice: number;
  totalQuantity: number;
  availableQuantity: number;
  categoryId: number;
}): Promise<Tool> {
  const response = await apiClient.post<Tool>("/tools", payload);
  return response.data;
}

export async function updateTool(
  id: number,
  payload: {
    name: string;
    description: string;
    dailyPrice: number;
    totalQuantity: number;
    availableQuantity: number;
    statusId: number;
    supplierId: number;
    categoryId: number;
  }
): Promise<Tool> {
  const response = await apiClient.put<Tool>(`/tools/${id}`, payload);
  return response.data;
}

export async function deleteTool(id: number): Promise<void> {
  await apiClient.delete(`/tools/${id}`);
}

