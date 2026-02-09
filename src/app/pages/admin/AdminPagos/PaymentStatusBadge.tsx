import React from 'react';
import { getStatusBadgeVariant, getStatusLabel } from './utils/paymentStatusUtils';
import { PaymentStatus } from './types/payments';
import { Badge } from '@/app/components/ui/badge';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => (
  <Badge variant={getStatusBadgeVariant(status)}>
    {getStatusLabel(status)}
  </Badge>
);

export default PaymentStatusBadge;
