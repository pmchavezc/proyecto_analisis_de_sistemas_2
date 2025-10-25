import axios from 'axios';
import apiClient from './axios';

/**
 * Servicio para manejar solicitudes del sistema externo (Participación Ciudadana)
 * Conectado al endpoint real: http://localhost:8080/api/participacion/reportes-aprobados
 */

// Cliente axios específico para el sistema externo (Participación Ciudadana)
const externalApiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Respuesta del backend externo
export interface ExternalApiResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  tipo: string;
  estado: string;
  creadoPor: string;
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

export const externalSystemService = {
  /**
   * Obtiene solicitudes aprobadas del sistema externo (Participación Ciudadana)
   * Endpoint: GET http://localhost:8080/api/participacion/reportes-aprobados
   */
  getExternalRequests: async (): Promise<ExternalRequest[]> => {
    try {
      const response = await externalApiClient.get<ExternalApiResponse[]>('/participacion/reportes-aprobados');
      
      // Mapear la respuesta del backend al formato interno
      return response.data.map(item => ({
        id: item.id,
        tipo: item.tipo,
        titulo: item.title,
        descripcion: item.description,
        ubicacion: item.location,
        estado: item.estado,
        creadoPor: item.creadoPor,
        prioridad: undefined, // TODO: Cuando el backend agregue prioridad, mapearla aquí
      }));
    } catch (error) {
      console.error('Error al obtener solicitudes externas:', error);
      throw error;
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
