import apiClient from "./axios";

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
  async solicitarFinanciamiento(
    idSolicitud: number,
    body: SolicitudFinanciamientoBody
  ) {
    console.log("Enviando solicitud de financiamiento:", {
      url: `/mantenimiento/solicitudes/${idSolicitud}/financiamiento`,
      body,
    });
    const response = await apiClient.post(
      `/mantenimiento/solicitudes/${idSolicitud}/financiamiento`,
      body
    );
    return response.data;
  },

  async solicitarFinanciamientoAdvanced(
    idSolicitud: number,
    payload: FinancingRequestPayload
  ) {
    const url = `/mantenimiento/solicitudes/${idSolicitud}/financiamiento`;
    try {
      console.log(
        "Enviando payload avanzado de financiamiento:",
        url,
        JSON.stringify(payload)
      );
      const response = await apiClient.post(url, payload);
      console.log("Respuesta del backend (financiamiento):", response.data);
      return response.data;
    } catch (err: unknown) {
      interface ErrWithResponse {
        response?: { status?: number; data?: unknown };
      }
      const r = (err as ErrWithResponse).response;
      console.error("Error en POST financiamiento:", r?.status, r?.data ?? err);
      throw err;
    }
  },

  async getAllFinancingRequests() {
    const preferred = "/mantenimiento/solicitud/financiamiento/todas";
    const fallback = "/mantenimiento/solicitudes/financiamiento/todas";

    try {
      const response = await apiClient.get(preferred);
      console.debug(`GET ${preferred} response:`, {
        status: response.status,
        data: response.data,
      });
      console.info(`Usando ruta preferida:   ${preferred}`);
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      console.warn(`GET ${preferred} falló con status ${status ?? "N/A"}`);
      if (status === 404) {
        try {
          const response2 = await apiClient.get(fallback);
          console.debug(`GET ${fallback} response:`, {
            status: response2.status,
            data: response2.data,
          });
          console.info(`Usando ruta fallback: ${fallback}`);
          return response2.data;
        } catch (err2) {
          console.error(`GET ${fallback} también falló:`, err2);
          throw err2;
        }
      }
      console.error(`Error al obtener solicitudes desde ${preferred}:`, err);
      throw err;
    }
  },

  async sincronizarEstadoFinanciero(idSolicitud: number) {
    const url = `/mantenimiento/solicitudes/${idSolicitud}/sincronizar-financiamiento`;
    try {
      const response = await apiClient.put(url);
      console.info(
        `Estado financiero sincronizado para solicitud ${idSolicitud}`
      );
      return response.status;
    } catch (err: unknown) {
      interface ErrWithResponse {
        response?: { status?: number; data?: unknown };
      }
      const r = (err as ErrWithResponse).response;
      console.error(
        "Error al sincronizar estado financiero:",
        r?.status,
        r?.data ?? err
      );
      throw err;
    }
  },
};
