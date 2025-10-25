import { useState, useEffect, useCallback } from 'react';
import { requestsService } from '../api/requestsService';
import { mapApiRequestsToRequests } from '../utils/mappers';
import type { Request } from '../types';
import { initialRequests } from '../data/mockData'; // Importar los datos mockeados

interface UseRequestsDataOptions {
  limit?: number; // Límite de solicitudes a mostrar
  autoFetch?: boolean; // Si debe hacer fetch automático al montar
  onlyPending?: boolean; // Si debe cargar solo pendientes o todas
}

interface UseRequestsDataReturn {
  requests: Request[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  registerMockRequest: () => Promise<void>;
}

/**
 * Hook personalizado para manejar la lógica de fetch de solicitudes
 * Proporciona estado de loading, error y función de refetch
 * 
 * @param options - Configuración opcional (limit, autoFetch, onlyPending)
 * @returns {UseRequestsDataReturn} Estado y funciones para manejar solicitudes
 * 
 * @example
 * // Para Dashboard (últimas 5 pendientes)
 * const { requests, loading, error } = useRequestsData({ limit: 5, onlyPending: true });
 * 
 * @example
 * // Para RequestsList (todas las solicitudes)
 * const { requests, loading, error, refetch } = useRequestsData();
 */
export function useRequestsData(options: UseRequestsDataOptions = {}): UseRequestsDataReturn {
  const { limit, autoFetch = true, onlyPending = false } = options;

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch desde la API según el tipo solicitado
      const apiRequests = onlyPending 
        ? await requestsService.getPendingRequests()
        : await requestsService.getAllRequests();
      
      let mappedRequests = mapApiRequestsToRequests(apiRequests);
      
      // Aplicar límite si se especifica
      if (limit && limit > 0) {
        mappedRequests = mappedRequests
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      }
      
      setRequests(mappedRequests);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
      setError('No se pudieron cargar las solicitudes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [limit, onlyPending]);

  const registerMockRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Tomar una solicitud mockeada de initialRequests con source: 'PARTICIPACION_CIUDADANA'
      const mockRequest = initialRequests.find(
        (req: Request) => req.source === 'PARTICIPACION_CIUDADANA'
      );

      if (!mockRequest) {
        throw new Error('No hay solicitudes mockeadas disponibles para registrar.');
      }

      const apiRequest = {
        id: 0, // ID predeterminado, será generado por el backend
        descripcion: mockRequest.description,
        ubicacion: mockRequest.location,
        prioridad: mockRequest.priority,
        estado: mockRequest.status,
        tipo: mockRequest.tipo,
        fecha: mockRequest.date,
        fuente: mockRequest.source,
        reporteExternoId: mockRequest.externalReportId,
        estadoFinanciero: mockRequest.financialStatus,
        fechaRegistro: new Date().toISOString(), // Fecha actual como fecha de registro
        reporteIdExtern: mockRequest.externalReportId || 0, // Usar el ID externo si está disponible, de lo contrario, usar 0
        idFinanciamiento: mockRequest.financingId,
        fechaProgramada: mockRequest.scheduledDate,
        cuadrillaAsignada: mockRequest.assignedCrew,
        recursosAsignados: mockRequest.assignedResources,
      };

      await requestsService.registerRequest(apiRequest);

      // Refetch para actualizar la tabla
      await fetchRequests();
    } catch (err) {
      console.error('Error al registrar solicitud:', err);
      setError('No se pudo registrar la solicitud. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [fetchRequests]);

  useEffect(() => {
    if (autoFetch) {
      fetchRequests();
    }
  }, [autoFetch, fetchRequests]);

  return { 
    requests, 
    loading, 
    error, 
    refetch: fetchRequests,
    registerMockRequest // Agregar la nueva función al retorno del hook
  };
}
