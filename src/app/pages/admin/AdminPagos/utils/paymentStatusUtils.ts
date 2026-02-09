import { PaymentStatus } from '../types/payments';

export function getStatusBadgeVariant(status: PaymentStatus) {
  switch (status) {
    case 'PAID':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function getStatusLabel(status: PaymentStatus) {
  switch (status) {
    case 'PAID':
      return 'Pagado';
    case 'PENDING':
      return 'Pendiente';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
}
