export type PaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED';

export type Payment = {
  id: number;
  reservationId: number;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
};
