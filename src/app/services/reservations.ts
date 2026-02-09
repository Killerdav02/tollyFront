import apiClient from '../../api/apiClient';

export async function getReservationById(reservationId: string) {
    const { data } = await apiClient.get(`/reservations/${reservationId}`);
    return data;
}
