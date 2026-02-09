import apiClient from "../api/apiClient";
import type { PageResponse, Reservation } from "./types";

export async function listReservationsBySupplier(params: {
  supplierId: number;
  statusName?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  sort?: string;
}): Promise<PageResponse<Reservation>> {
  const { supplierId, ...query } = params;
  const response = await apiClient.get<PageResponse<Reservation>>(
    `/api/reservations/supplier/${supplierId}`,
    { params: query }
  );
  return response.data;
}

