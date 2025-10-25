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
};
