import apiClient from '@/api/apiClient';

export interface Client {
  id: string | number;
  name: string;
  // Puedes agregar más campos si los necesitas
}

export async function fetchClientName(clientId: string | number): Promise<string> {
  try {
    const { data } = await apiClient.get<Client>(`/api/clients/${clientId}`);
    if (data.firstName && data.lastName) {
      return `${data.firstName} ${data.lastName}`;
    }
    if (data.firstName) return data.firstName;
    return 'Desconocido';
  } catch {
    return 'Desconocido';
  }
}
