import apiClient from './axios';

// Tipo simple para el monto estimado (el backend ya no espera tipo/adjuntos desde el front)
export interface SolicitudFinanciamientoBody {
  montoEstimado: number;
}

export interface FinancingRequestPayload {
  originId: number;
  requestAmount: number;
  name: string;
  reason: string;
  requestDate: string; // YYYY-MM-DD
  email?: string;
  priorityId?: number;
}

export const financiamientoService = {
  async solicitarFinanciamiento(idSolicitud: number, body: SolicitudFinanciamientoBody) {
    // Log para control
    console.log('Enviando solicitud de financiamiento:', {
      url: `/mantenimiento/solicitudes/${idSolicitud}/financiamiento`,
      body,
    });
    const response = await apiClient.post(`/mantenimiento/solicitudes/${idSolicitud}/financiamiento`, body);
    return response.data;
  },
  
  // Nuevo método que envía el JSON que el backend espera para solicitudes de financiamiento
  async solicitarFinanciamientoAdvanced(idSolicitud: number, payload: FinancingRequestPayload) {
    const url = `/mantenimiento/solicitudes/${idSolicitud}/financiamiento`;
    try {
      console.log('Enviando payload avanzado de financiamiento:', url, JSON.stringify(payload));
      const response = await apiClient.post(url, payload);
      console.log('Respuesta del backend (financiamiento):', response.data);
      return response.data;
    } catch (err: unknown) {
      // Mostrar detalles para depuración
  interface ErrWithResponse { response?: { status?: number; data?: unknown } }
  const r = (err as ErrWithResponse).response;
      console.error('Error en POST financiamiento:', r?.status, r?.data ?? err);
      // Re-throw para que el caller lo maneje
      throw err;
    }
  },

  // Método para obtener todas las solicitudes que fueron enviadas a financiamiento
  async getAllFinancingRequests() {
    const preferred = '/mantenimiento/solicitud/financiamiento/todas'; // ruta solicitada por el usuario
    const fallback = '/mantenimiento/solicitudes/financiamiento/todas'; // ruta que el backend podría exponer

    // Intentar la ruta preferida primero
    try {
      const response = await apiClient.get(preferred);
      try { console.debug(`GET ${preferred} response:`, { status: response.status, data: response.data }); } catch (e) { /* ignore */ }
      console.info(`Usando ruta preferida: ${preferred}`);
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      console.warn(`GET ${preferred} falló con status ${status ?? 'N/A'}`);
      // Si el error fue 404, intentar la ruta fallback
      if (status === 404) {
        try {
          const response2 = await apiClient.get(fallback);
          try { console.debug(`GET ${fallback} response:`, { status: response2.status, data: response2.data }); } catch (e) { /* ignore */ }
          console.info(`Usando ruta fallback: ${fallback}`);
          return response2.data;
        } catch (err2) {
          console.error(`GET ${fallback} también falló:`, err2);
          throw err2;
        }
      }

      // Si no fue 404 (por ejemplo 401/500), propagar el error original
      console.error(`Error al obtener solicitudes desde ${preferred}:`, err);
      throw err;
    }
   },
};
