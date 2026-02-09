import apiClient from "../api/apiClient";
import type { ReturnResponse } from "./types";

export async function listReturns(): Promise<ReturnResponse[]> {
  const response = await apiClient.get<ReturnResponse[]>("/returns");
  return response.data;
}

export async function getReturnById(returnId: number): Promise<ReturnResponse> {
  const response = await apiClient.get<ReturnResponse>(`/returns/${returnId}`);
  return response.data;
}

export async function receiveReturn(
  returnId: number,
  payload: {
    returnStatusName: "RECEIVED" | "DAMAGED" | "SPP_INCOMPLETE";
    details?: Array<{ toolId: number; quantity: number; observations?: string }>;
    observations?: string;
  }
): Promise<ReturnResponse> {
  const response = await apiClient.put<ReturnResponse>(`/returns/${returnId}/receive`, payload);
  return response.data;
}
