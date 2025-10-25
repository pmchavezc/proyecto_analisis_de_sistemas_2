import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Header from '../components/Header';
import Layout from '../components/Layout';
import RequestsTable from '../components/RequestsTable';
import LoadingState from '../components/LoadingState';
import { useRequestsData } from '../hooks/useRequestsData';

/**
 * Página de lista completa de solicitudes
 * Muestra TODAS las solicitudes (pendientes, programadas, finalizadas)
 * Utiliza componentes optimizados y hook personalizado para gestión de datos
 * Permite filtrado por ESTADO y PRIORIDAD
 */
export default function RequestsList() {
  const navigate = useNavigate();
  const [estadoFilter, setEstadoFilter] = useState<string>(''); // Filtro por estado
  const [prioridadFilter, setPrioridadFilter] = useState<string>(''); // Filtro por prioridad
  const [fechaFilter, setFechaFilter] = useState<string>(''); // Filtro por fecha

  // Hook personalizado para manejar datos de solicitudes (TODAS, sin límite)
  const { requests, loading, error, refetch } = useRequestsData();

  // Función para manejar programación de solicitud
  const handleProgramRequest = (id: number | string) => {
    navigate(`/programar/${id}`);
  };

  // Aplicar filtros localmente (temporal hasta que el backend los soporte)
  const filteredRequests = requests.filter(request => {
    if (estadoFilter && request.status !== estadoFilter) return false; // Filtro por estado
    if (prioridadFilter && request.priority !== prioridadFilter) return false; // Filtro por prioridad
    if (fechaFilter && request.date !== fechaFilter) return false; // Filtro por fecha exacta
    return true;
  });
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Gestión de Mantenimiento Urbano"
          showSearch={false}
        />

      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Título */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
              <FileText className="text-green-700" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Todas las Solicitudes</h2>
          </div>

          {/* Filtros de Estado, Prioridad y Fecha */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Estado
              </label>
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="PROGRAMADA">Programada</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Prioridad
              </label>
              <select
                value={prioridadFilter}
                onChange={(e) => setPrioridadFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="">Todas las prioridades</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Fecha
              </label>
              <input
                type="date"
                value={fechaFilter}
                onChange={(e) => setFechaFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Estado de carga/error usando componente reutilizable */}
          <LoadingState 
            loading={loading} 
            error={error} 
            empty={!loading && !error && filteredRequests.length === 0}
            emptyMessage="No hay solicitudes que coincidan con los filtros."
            onRetry={refetch}
          />

          {/* Tabla de solicitudes usando componente reutilizable */}
          {!loading && !error && filteredRequests.length > 0 && (
            <>
              <RequestsTable
                requests={paginatedRequests}
                variant="full"
                showFinancialStatus={true}
                showActions={true}
                showFinancingButton={true}
                onProgramRequest={handleProgramRequest}
              />

              <div className="mt-4 text-sm text-gray-600">
                Mostrando 1-{filteredRequests.length} de {requests.length} resultados
                {filteredRequests.length !== requests.length && ` (filtrado de ${requests.length})`}
              </div>
            </>
          )}
          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="mx-2 text-gray-700">Página {currentPage} de {totalPages}</span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </main>
      </div>
    </Layout>
  );
}
