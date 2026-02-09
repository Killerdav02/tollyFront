import React from 'react';
import { PaymentWithClient } from './types/payments';
import PaymentStatusBadge from './PaymentStatusBadge';
import { formatCurrency, formatDate } from './utils/paymentFormatters';
import { getStatusBadgeVariant, getStatusLabel } from './utils/paymentStatusUtils';

interface PaymentsTableProps {
  payments: PaymentWithClient[];
  isLoading: boolean;
  onViewDetail: (payment: PaymentWithClient) => void;
}


import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Eye, MoreVertical, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, isLoading, onViewDetail }) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d5a5a]"></div>
        <p className="mt-4 text-gray-600">Cargando pagos...</p>
      </div>
    );
  }

  // Empty State
  if (!isLoading && payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Search className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron pagos</h3>
        <p className="text-gray-600 text-center mb-4">
          No hay transacciones que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
              
              <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Monto</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const display = {
                id: payment.payment.id,
                clienteNombre: payment.clienteNombre ?? '-',
                herramientaNombre: (payment.reservation as any)?.details?.[0]?.toolName ?? '-',
                metodoPago: (payment.reservation as any)?.metodoPago ?? '-',
                fecha: payment.payment.paymentDate,
                monto: payment.payment.amount,
                estado: payment.payment.status,
              };
              return (
                <tr key={display.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">#{display.id}</td>
                  <td className="py-3 px-4 font-medium">{display.clienteNombre}</td>
                  
                  <td className="py-3 px-4 text-gray-600">{formatDate(display.fecha)}</td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">${formatCurrency(Number(display.monto))}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadgeVariant(display.estado)}>
                      {getStatusLabel(display.estado)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetail(payment)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tablet View - Simplified Table */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Pago</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Monto</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">#{payment.payment.id}</p>
                    <p className="text-sm text-gray-500 truncate">{payment.reservation?.toolName ?? ''}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium truncate">{payment.clienteNombre ?? 'Desconocido'}</p>
                    <p className="text-sm text-gray-500">{formatDate(payment.payment.paymentDate)}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-medium text-green-600">${formatCurrency(Number(payment.payment.amount))}</td>
                <td className="py-3 px-4">
                  <PaymentStatusBadge status={payment.payment.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetail(payment)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {payments.map((payment) => (
          <div key={payment.payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">#{payment.payment.id}</span>
                  <PaymentStatusBadge status={payment.payment.status} />
                </div>
                <h3 className="font-medium text-gray-900 truncate">{payment.clienteNombre ?? 'Desconocido'}</h3>
                <p className="text-sm text-gray-500 truncate">{payment.reservation?.toolName ?? ''}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onViewDetail(payment)}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t">
              <div>
                <p className="text-gray-500 text-xs mb-1">Monto</p>
                <p className="font-medium text-green-600">${formatCurrency(Number(payment.payment.amount))}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Fecha</p>
                <p className="font-medium">{formatDate(payment.payment.paymentDate)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs mb-1">Método de Pago</p>
                <p className="font-medium">-</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentsTable;
