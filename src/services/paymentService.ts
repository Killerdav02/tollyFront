import apiClient from "../api/apiClient";
import type { Payment } from "./types";

export async function listPaymentsBySupplier(
  supplierId: number,
  params?: { from?: string; to?: string }
): Promise<Payment[]> {
  const response = await apiClient.get<Payment[]>(`/payments/supplier/${supplierId}`, { params });
  return response.data;
}
