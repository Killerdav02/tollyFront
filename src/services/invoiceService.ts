import apiClient from "../api/apiClient";
import type { Invoice } from "./types";

export async function listInvoicesBySupplier(supplierId: number): Promise<Invoice[]> {
  const response = await apiClient.get<Invoice[]>(`/invoices/supplier/${supplierId}`);
  return response.data;
}

export async function searchInvoices(params: {
  supplierId: number;
  from?: string;
  to?: string;
  paymentStatus?: string;
}): Promise<Invoice[]> {
  const { supplierId, ...query } = params;
  const response = await apiClient.get<Invoice[]>(`/invoices/supplier/${supplierId}/search`, { params: query });
  return response.data;
}

export async function getInvoiceHtml(invoiceId: number): Promise<string> {
  const response = await apiClient.get(`/invoices/${invoiceId}/html`, { responseType: "text" });
  return response.data as string;
}

export async function getInvoicePdf(invoiceId: number): Promise<Blob> {
  const response = await apiClient.get(`/invoices/${invoiceId}/pdf`, { responseType: "blob" });
  return response.data as Blob;
}
