import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Download, DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';
import { listPaymentsBySupplier } from '../../../services/paymentService';
import { listInvoicesBySupplier, getInvoiceHtml, getInvoicePdf, searchInvoices } from '../../../services/invoiceService';
import type { Invoice, Payment } from '../../../services/types';

const SUPPLIER_ID_KEY = 'tolly_supplier_id';

export function ProveedorFacturacion() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const supplierId = useMemo(() => {
    const stored = localStorage.getItem(SUPPLIER_ID_KEY);
    if (stored && !Number.isNaN(Number(stored))) return Number(stored);
    return null;
  }, []);

  const loadData = async () => {
    if (!supplierId) {
      setError('No se pudo determinar tu proveedor. Crea una herramienta o confirma con el administrador.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [paymentData, invoiceData] = await Promise.all([
        listPaymentsBySupplier(supplierId),
        listInvoicesBySupplier(supplierId),
      ]);
      setPayments(paymentData);
      setInvoices(invoiceData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo cargar la facturación.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [supplierId]);

  const handleSearch = async () => {
    if (!supplierId) return;
    setLoading(true);
    try {
      const from = dateRange.start ? `${dateRange.start}T00:00:00` : undefined;
      const to = dateRange.end ? `${dateRange.end}T23:59:59` : undefined;
      const [paymentData, invoiceData] = await Promise.all([
        listPaymentsBySupplier(supplierId, { from, to }),
        searchInvoices({ supplierId, from, to }),
      ]);
      setPayments(paymentData);
      setInvoices(invoiceData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo filtrar la facturación.');
    } finally {
      setLoading(false);
    }
  };

  const ingresosTotales = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const ingresosMesActual = payments
    .filter((payment) => {
      const date = payment.paymentDate ? new Date(payment.paymentDate) : null;
      const now = new Date();
      return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const handleViewHtml = async (invoiceId: number) => {
    try {
      const html = await getInvoiceHtml(invoiceId);
      const popup = window.open('', '_blank');
      if (popup) {
        popup.document.write(html);
        popup.document.close();
      }
    } catch {
      setError('No se pudo cargar la factura en HTML.');
    }
  };

  const handleDownloadPdf = async (invoiceId: number) => {
    try {
      const blob = await getInvoicePdf(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('No se pudo descargar el PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-600 mt-1">Gestiona tus ingresos y facturas</p>
        </div>
        <Button onClick={loadData}>
          <Download className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filtros por fecha</CardTitle>
          <CardDescription>Consulta pagos y facturas por rango de fechas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm text-gray-600">Desde</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Hasta</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <Button onClick={handleSearch} className="bg-[#7fb3b0] hover:bg-[#6da39f]">
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ingresosTotales.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Acumulado histórico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mes Actual
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${ingresosMesActual.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">Pagos del mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pagos Registrados
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Transacciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Facturas Emitidas
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Documentos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagos Recibidos</CardTitle>
          <CardDescription>Listado de pagos asociados a tus herramientas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Reserva</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Monto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">#{payment.id}</td>
                    <td className="py-3 px-4 text-gray-600">#{payment.reservationId}</td>
                    <td className="py-3 px-4 text-gray-600">${Number(payment.amount).toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('es-ES') : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && payments.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No hay pagos registrados.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facturas Generadas</CardTitle>
          <CardDescription>Consulta y descarga facturas de tus alquileres</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Factura</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Reserva</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{invoice.code || `INV-${invoice.id}`}</td>
                    <td className="py-3 px-4 text-gray-600">#{invoice.reservationId}</td>
                    <td className="py-3 px-4 text-gray-600">${Number(invoice.total).toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('es-ES') : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewHtml(invoice.id)}>
                          Ver HTML
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadPdf(invoice.id)}>
                          PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && invoices.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No hay facturas registradas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
