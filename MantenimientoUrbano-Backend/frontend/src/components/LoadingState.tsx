import { AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
}

/**
 * Componente reutilizable para manejar estados de carga, error y vacío
 * 
 * @param loading - Si está en estado de carga
 * @param error - Mensaje de error (si existe)
 * @param empty - Si no hay datos para mostrar
 * @param emptyMessage - Mensaje personalizado cuando no hay datos
 * @param onRetry - Función para reintentar en caso de error
 * 
 * @example
 * <LoadingState 
 *   loading={loading} 
 *   error={error} 
 *   empty={requests.length === 0}
 *   onRetry={refetch}
 * />
 */
export default function LoadingState({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No hay datos para mostrar.',
  onRetry,
}: LoadingStateProps) {
  // Estado de carga
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  // Estado vacío
  if (empty) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  // No renderizar nada si no hay estados especiales
  return null;
}
