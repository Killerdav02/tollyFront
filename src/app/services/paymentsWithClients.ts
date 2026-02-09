import { CancelTokenSource } from 'axios';
import apiClient from '@/api/apiClient';
import { fetchClientName } from '@/app/services/clientService';

export type Payment = {
    id: string | number;
    reservationId: string | number;
    status: string;
    amount: number;
    paymentDate: string;
};

export type Reservation = {
    id: string | number;
    clientId: string | number;
    clienteNombre?: string;
};

export type PaymentWithClient = {
    payment: Payment;
    reservation: Reservation | null;
    clientId: string | number | null;
    clienteNombre?: string;
    reservationError?: boolean;
    errorMessage?: string;
};

export type PaymentSearchFilters = {
    status?: string;
    from?: string;
    to?: string;
};

const reservationCache = new Map<string | number, Promise<Reservation | null>>();

async function concurrentMap<T, R>(
    items: T[],
    mapper: (item: T) => Promise<R>,
    concurrency = 5
): Promise<R[]> {
    const results: R[] = [];
    let i = 0;
    async function worker() {
        while (i < items.length) {
            const idx = i++;
            try {
                results[idx] = await mapper(items[idx]);
            } catch (e) {
                results[idx] = e as any;
            }
        }
    }
    await Promise.all(Array(concurrency).fill(0).map(worker));
    return results;
}

export async function fetchPaymentsWithClients(
    filters: PaymentSearchFilters,
    options?: { concurrency?: number; cancelToken?: CancelTokenSource }
): Promise<PaymentWithClient[]> {
    const { data: payments } = await apiClient.get<Payment[]>('/payments/search', {
        params: filters,
        cancelToken: options?.cancelToken?.token,
    });

    const uniqueReservationIds = Array.from(
        new Set(payments.map(p => p.reservationId).filter(Boolean))
    );

    const getReservation = async (reservationId: string | number): Promise<Reservation | null> => {
        if (!reservationId) return null;
        if (reservationCache.has(reservationId)) {
            return reservationCache.get(reservationId)!;
        }
        const promise = apiClient
            .get<Reservation>(`/api/reservations/${reservationId}`, {
                cancelToken: options?.cancelToken?.token,
            })
            .then(res => res.data)
            .catch(() => null);
        reservationCache.set(reservationId, promise);
        return promise;
    };

    const reservationMap: Record<string | number, Reservation | null> = {};
    await concurrentMap(
        uniqueReservationIds,
        async (rid) => {
            reservationMap[rid] = await getReservation(rid);
        },
        options?.concurrency ?? 5
    );

    // Obtener nombres de clientes
    const clientIdSet = new Set<string | number>();
    Object.values(reservationMap).forEach(res => {
      if (res && res.clientId) clientIdSet.add(res.clientId);
    });
    const clientNamesMap: Record<string | number, string> = {};
    await concurrentMap(
      Array.from(clientIdSet),
      async (cid) => {
        clientNamesMap[cid] = await fetchClientName(cid);
      },
      options?.concurrency ?? 5
    );

    return payments.map(payment => {
        const reservation = reservationMap[payment.reservationId];
        if (!payment.reservationId) {
            return {
                payment,
                reservation: null,
                clientId: null,
                clienteNombre: undefined,
                reservationError: true,
                errorMessage: 'Sin reservationId',
            };
        }
        if (!reservation) {
            return {
                payment,
                reservation: null,
                clientId: null,
                clienteNombre: undefined,
                reservationError: true,
                errorMessage: 'No se pudo obtener la reserva',
            };
        }
        if (!reservation.clientId) {
            return {
                payment,
                reservation,
                clientId: null,
                clienteNombre: undefined,
                reservationError: true,
                errorMessage: 'Reserva sin clientId',
            };
        }
        return {
            payment,
            reservation,
            clientId: reservation.clientId,
            clienteNombre: clientNamesMap[reservation.clientId] ?? undefined,
        };
    });
}
