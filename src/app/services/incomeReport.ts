import apiClient from '@/api/apiClient';

export interface IncomeReport {
  totalIncome?: number;
  month?: number;
}

export async function fetchIncomeReport(from?: string, to?: string): Promise<IncomeReport> {
  const params: any = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await apiClient.get('/admin/reports/income', { params });
  return data;
}
