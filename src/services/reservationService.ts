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

export async function finishReservation(reservationId: number): Promise<Reservation> {
  const response = await apiClient.put<Reservation>(`/api/reservations/${reservationId}/finish`);
  return response.data;
}

export async function incidentReservation(reservationId: number): Promise<Reservation> {
  const response = await apiClient.put<Reservation>(`/api/reservations/${reservationId}/incident`);
  return response.data;
}
