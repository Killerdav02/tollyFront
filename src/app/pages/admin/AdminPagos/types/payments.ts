export type Payment = {
  id: string | number;
  reservationId: string | number;
  status: string;
  amount: number;
  paymentDate: string;
};

export type PaymentWithClient = {
  payment: Payment;
  reservation: any; // Puedes tipar mejor si tienes el tipo
  clientId: string | number | null;
  clienteNombre?: string;
  reservationError?: boolean;
  errorMessage?: string;
};

export type PaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED' | string;
