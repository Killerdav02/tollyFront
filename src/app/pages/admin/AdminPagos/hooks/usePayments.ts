import { useEffect, useState } from 'react';
import { fetchPaymentsWithClients, PaymentWithClient, PaymentSearchFilters } from '@/app/services/paymentsWithClients';
import { fetchIncomeReport } from '@/app/services/incomeReport';

export function usePayments() {
  const [payments, setPayments] = useState<PaymentWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incomeReport, setIncomeReport] = useState<{ total: number; month: number }>({ total: 0, month: 0 });
  const [filters, setFilters] = useState<{ status?: string; from?: string; to?: string }>({});

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchPaymentsWithClients(filters)
      .then(setPayments)
      .catch(e => setError(e.message || 'Error al cargar pagos'))
      .finally(() => setIsLoading(false));

    // Calcular rango del mes actual
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const from = new Date(year, month, 1, 0, 0, 0);
    // Último día del mes actual
    const to = new Date(year, month + 1, 0, 23, 59, 59);
    // Formato ISO: YYYY-MM-DDTHH:mm:ss
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const fromISO = formatDate(from);
    const toISO = formatDate(to);

    fetchIncomeReport(fromISO, toISO)
      .then((data) => setIncomeReport({ total: data.totalIncome ?? 0, month: data.month ?? 0 }))
      .catch(() => setIncomeReport({ total: 0, month: 0 }));
  }, [filters]);

  // setPayments ahora también puede recibir filtros
  const setPaymentsWithFilters = (newFilters: { status?: string; from?: string; to?: string }) => {
    setFilters(newFilters);
  };

  return { payments, isLoading, error, incomeReport, setPayments: setPaymentsWithFilters, setError, setIsLoading };
}
