import apiClient from '../../api/apiClient';
import { Payment, PaymentStatus } from '../types/payments';

export async function getPaymentsByClientId(clientId: string): Promise<Payment[]> {
  const { data } = await apiClient.get<Payment[]>(`/payments/client/${clientId}`);
  return data;
}

export async function searchPayments(params: { status: PaymentStatus; from: string; to: string }): Promise<Payment[]> {
  const { status, from, to } = params;
  const searchParams = new URLSearchParams({ status, from, to });
  const { data } = await apiClient.get<Payment[]>(`/payments/search?${searchParams.toString()}`);
  return data;
}
