import apiClient from './axios';
import type { ApiRequest } from '../types';

// Servicio para manejar todas las peticiones relacionadas con solicitudes
export const requestsService = {
  // Obtener todas las solicitudes (sin importar estado)
  getAllRequests: async (): Promise<ApiRequest[]> => {
    const response = await apiClient.get<ApiRequest[]>('/mantenimiento/solicitudes/todas');
    return response.data;
  },

  // Obtener solo las solicitudes pendientes
  getPendingRequests: async (): Promise<ApiRequest[]> => {
    const response = await apiClient.get<ApiRequest[]>('/mantenimiento/solicitudes/pendientes');
    return response.data;
  },

  // Registrar una nueva solicitud
  registerRequest: async (requestData: ApiRequest): Promise<void> => {
    await apiClient.post('/mantenimiento/solicitudes', requestData);
  },

  // Programar una solicitud (asignar fecha, cuadrilla y recursos)
  programRequest: async (id: number, body: { fechaInicio: string; cuadrilla: string; recursos: string[] }) => {
    const response = await apiClient.post(`/mantenimiento/solicitudes/${id}/programar`, body);
    return response.data;
  },
};
