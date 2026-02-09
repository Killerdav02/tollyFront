import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/app/components/ui/sheet';
import { PaymentWithClient } from './types/payments';
import PaymentStatusBadge from './PaymentStatusBadge';
import { formatCurrency, formatDate } from './utils/paymentFormatters';

interface PaymentDetailSheetProps {
  open: boolean;
  payment: PaymentWithClient | null;
  onOpenChange: (open: boolean) => void;
}

const PaymentDetailSheet: React.FC<PaymentDetailSheetProps> = ({ open, payment, onOpenChange }) => {
  if (!payment) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto px-6 sm:px-8">
        <SheetHeader>
          <SheetTitle>Detalles del Pago</SheetTitle>
          <SheetDescription>
            Información completa de la transacción
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex justify-center">
            <PaymentStatusBadge status={payment.payment.status} />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500">ID de Transacción</span>
              <p className="text-xl font-bold text-gray-900">#{payment.payment.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">Monto</span>
                <p className="text-2xl font-bold text-green-600">
                  ${formatCurrency(Number(payment.payment.amount))}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Fecha</span>
                <p className="text-lg font-medium text-gray-900">
                  {formatDate(payment.payment.paymentDate)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Detalles Asociados</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Cliente</span>
                <span className="font-medium text-right">{payment.clienteNombre ?? 'Desconocido'}</span>
              </div>
              {/* Otros detalles asociados aquí si aplica */}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> Esta transacción ha sido procesada correctamente. Para cualquier consulta adicional, contacta al soporte técnico.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PaymentDetailSheet;
