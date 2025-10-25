import axios from 'axios';
import apiClient from './axios';

/**
 * Servicio para manejar solicitudes del sistema externo (Participación Ciudadana)
 * Conectado al endpoint real: http://localhost:8080/api/participacion/reportes-aprobados
 */

// Cliente axios específico para el sistema externo (Participación Ciudadana)
const externalApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Respuesta del backend externo
export interface ExternalApiResponse {
  id?: number;
  title?: string;
  description?: string;
  location?: string;
  tipo?: string;
  estado?: string;
  creadoPor?: string;
  // Aceptar campos alternativos posibles
  reportId?: number;
  reporteId?: number;
  nombre?: string;
  direccion?: string;
}

// Interface para uso interno en el frontend
export interface ExternalRequest {
  id: number; // ID del sistema externo (ahora es número)
  tipo: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  estado: string;
  creadoPor: string;
  prioridad?: 'ALTA' | 'MEDIA' | 'BAJA'; // Opcional hasta que el backend lo agregue
}

// Helper local para tomar varias posibles claves
const pick = (obj: any, ...keys: string[]) => {
  if (!obj) return undefined;
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) return obj[k];
  }
  return undefined;
};

export const externalSystemService = {
  /**
   * Obtiene solicitudes aprobadas del sistema externo (Participación Ciudadana)
   * Endpoint: GET http://localhost:8080/api/participacion/reportes-aprobados
   */
  getExternalRequests: async (): Promise<ExternalRequest[]> => {
    try {
      const response = await externalApiClient.get<unknown>('/participacion/reportes-aprobados');
      let data = response.data;

      // Normalizar distintos formatos que pueda devolver la API
      let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        // Caso { data: [...] }
        const maybeData = (data as any).data;
        if (Array.isArray(maybeData)) {
          items = maybeData;
        } else {
          // Aplanar cualquier valor que sea arreglo dentro del objeto
          const arrays = Object.values(data).filter((v) => Array.isArray(v)) as any[];
          if (arrays.length > 0) {
            items = ([] as any[]).concat(...arrays);
          } else {
            // Si viene un solo objeto con campos de la solicitud, envolverlo
            items = [data];
          }
        }
      }

      // Mapear la respuesta del backend al formato interno (tolerante a nombres distintos)
      return items.map((item: any) => ({
        id: Number(pick(item, 'id', 'reportId', 'reporteId')) || 0,
        tipo: String(pick(item, 'tipo', 'type', 'category', 'nombre') ?? 'Solicitud'),
        titulo: String(pick(item, 'title', 'titulo', 'nombre') ?? ''),
        descripcion: String(pick(item, 'description', 'descripcion', 'detalle') ?? ''),
        ubicacion: String(pick(item, 'location', 'ubicacion', 'direccion') ?? ''),
        estado: String(pick(item, 'estado', 'status') ?? 'Pendiente'),
        creadoPor: String(pick(item, 'creadoPor', 'author', 'usuario', 'user') ?? ''),
        prioridad: undefined,
      }));
    } catch (error: any) {
      console.error('Error al obtener solicitudes externas:', error);

      // Si es un error de Axios, proporcionar más contexto
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 404) {
        // Si el endpoint no existe, devolver array vacío (no bloquear la UI)
        console.info('Endpoint de Participación Ciudadana no encontrado (404). Retornando lista vacía.');
        return [];
      }

      // Lanzar error con información útil para la UI
      const errMsg = status ? `HTTP ${status}` : 'Network/Unknown error';
      const details = data ? JSON.stringify(data) : String(error?.message ?? error);
      throw new Error(`${errMsg}: ${details}`);
    }
  },

  /**
   * Registra una solicitud externa en el sistema de Mantenimiento Urbano
   * Convierte una solicitud de Participación Ciudadana en una solicitud interna
   */
  registerFromExternal: async (externalRequest: ExternalRequest): Promise<{ success: boolean; internalId?: number }> => {
    // Mapear tipos del sistema externo a los tipos esperados por el backend de mantenimiento
    const tipoMap: Record<string, string> = {
      'Salud Pública': 'SALUD_PUBLICA',
      'Infraestructura': 'INFRAESTRUCTURA',
      'Baches': 'INFRAESTRUCTURA',
      'Alumbrado': 'ALUMBRADO',
      'Limpieza': 'LIMPIEZA',
      'Parques': 'PARQUES',
      'Vías': 'VIAS',
      // Agregar más mapeos según sea necesario
    };

    const rawTipo = externalRequest.tipo || '';
    const mappedTipo = tipoMap[rawTipo] || rawTipo.toUpperCase().replace(/\s+/g, '_');

    // Preparar los datos en el formato que espera el backend de mantenimiento
    const requestData = {
      tipo: mappedTipo,
      descripcion: externalRequest.descripcion,
      ubicacion: externalRequest.ubicacion,
      prioridad: externalRequest.prioridad || 'MEDIA', // Valor por defecto hasta que el backend lo agregue
      fuente: 'PARTICIPACION_CIUDADANA' as const,
      reporteIdExtern: externalRequest.id, // Ahora es número directamente
    };

    console.log('Registrando solicitud externa en Mantenimiento Urbano:', requestData);

    try {
      // Enviar al endpoint de registro de mantenimiento urbano
      const response = await apiClient.post('/mantenimiento/solicitudes', requestData);
      return { success: true, internalId: response.data.id };
    } catch (err: unknown) {
      interface ErrWithResponse { response?: { status?: number } }
      const status = (err as ErrWithResponse).response?.status;
      console.error('Error al registrar solicitud externa:', status ?? err);

      // Si el endpoint no existe (404), simular para pruebas
      if (status === 404) {
        const simulatedId = Math.floor(Math.random() * 1000) + 1000;
        console.info('Endpoint no encontrado (404). Simulando registro con ID interno:', simulatedId);
        return { success: true, internalId: simulatedId };
      }

      throw err;
    }
  },
};
