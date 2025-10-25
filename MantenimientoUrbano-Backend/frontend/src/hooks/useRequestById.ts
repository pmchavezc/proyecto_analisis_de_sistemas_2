import { useState, useEffect } from 'react';
import { requestsService } from '../api/requestsService';
import { mapApiRequestsToRequests } from '../utils/mappers';
import type { Request } from '../types';

interface UseRequestByIdReturn {
  request: Request | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook personalizado para cargar una solicitud específica por ID
 * 
 * @param id - ID de la solicitud a cargar
 * @returns Estado y datos de la solicitud
 * 
 * @example
 * const { request, loading, error } = useRequestById(5);
 */
export function useRequestById(id: number | string | undefined): UseRequestByIdReturn {
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = async () => {
    if (!id) {
      setError('ID de solicitud no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener todas las solicitudes y filtrar por ID
      // (Si el backend implementa GET /solicitudes/:id en el futuro, usar ese endpoint)
      const allRequests = await requestsService.getAllRequests();
      const mappedRequests = mapApiRequestsToRequests(allRequests);
      
      const foundRequest = mappedRequests.find(
        req => req.id === Number(id)
      );

      if (!foundRequest) {
        throw new Error(`No se encontró la solicitud con ID ${id}`);
      }

      setRequest(foundRequest);
    } catch (err) {
      console.error('Error al cargar solicitud:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar la solicitud');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    request,
    loading,
    error,
    refetch: fetchRequest,
  };
}
