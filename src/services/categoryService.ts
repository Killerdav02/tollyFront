import apiClient from "../api/apiClient";
import type { Category } from "./types";

export async function listCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
}

