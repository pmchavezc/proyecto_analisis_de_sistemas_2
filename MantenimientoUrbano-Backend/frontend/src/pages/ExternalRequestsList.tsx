import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Download, MoreVertical, FileText } from 'lucide-react';
import Header from '../components/Header';
import Layout from '../components/Layout';
import LoadingState from '../components/LoadingState';
import ModalConfirmExternalRequest from '../components/ModalConfirmExternalRequest';
import { externalSystemService, type ExternalRequest } from '../api/externalSystemService';
import { showSuccessToast, showErrorToast } from '../utils/toast';

/**
 * Página de solicitudes recibidas de Participación Ciudadana
 * Muestra solicitudes del sistema externo pendientes de registro
 * Permite importarlas al sistema de Mantenimiento Urbano
 */
export default function ExternalRequestsList() {
  // const navigate = useNavigate();
  const [requests, setRequests] = useState<ExternalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ExternalRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  // Filtros
  const [prioridadFilter, setPrioridadFilter] = useState('');

  // Cargar solicitudes externas al montar
  useEffect(() => {
    fetchExternalRequests();
  }, []);

  const fetchExternalRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await externalSystemService.getExternalRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error al cargar solicitudes externas:', err);
      setError('No se pudieron cargar las solicitudes de Participación Ciudadana.');
    } finally {
      setLoading(false);
    }
  };
  // Filtrado
  const filteredRequests = requests.filter(request => {
  if (prioridadFilter && request.prioridad !== prioridadFilter) return false;
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

  const handleRegisterRequest = (request: ExternalRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleConfirmRegister = async (prioridad: 'ALTA' | 'MEDIA' | 'BAJA') => {
    if (!selectedRequest) return;

    try {
      setRegistering(true);
      
      // Crear una copia de la solicitud con la prioridad seleccionada
      const requestWithPriority = {
        ...selectedRequest,
        prioridad
      };
      
      const result = await externalSystemService.registerFromExternal(requestWithPriority);
      
      if (result.success) {
        // Mostrar mensaje de éxito con toast
        showSuccessToast(`✓ Solicitud registrada exitosamente con ID: ${result.internalId}`);
        
        // Remover la solicitud de la lista (ya fue registrada)
        setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
        
        // Cerrar modal
        setIsModalOpen(false);
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error('Error al registrar solicitud:', err);
      showErrorToast('✗ Error al registrar la solicitud. Por favor, intenta de nuevo.');
    } finally {
      setRegistering(false);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'ALTA': return 'bg-red-100 text-red-800';
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
      case 'BAJA': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Aprobado': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Componente de menú de acciones
  const ActionMenu = ({ request }: { request: ExternalRequest }) => {
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          onClick={() => setOpenMenuId(openMenuId === request.id ? null : request.id)}
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
        {openMenuId === request.id && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <ul className="py-1">
              <li>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50"
                  onClick={() => {
                    setOpenMenuId(null);
                    handleRegisterRequest(request);
                  }}
                >
                  <FileText className="w-4 h-4 text-blue-500" /> Registrar Solicitud
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

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
              <Download className="text-green-700" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Solicitudes Recibidas de Participación Ciudadana
            </h2>
          </div>

          <p className="text-gray-600 mb-6">
            Solicitudes reportadas por ciudadanos a través del sistema de Participación Ciudadana.
            Haz clic en "Registrar" para importarlas al sistema de Mantenimiento Urbano.
          </p>

          {/* Filtro de prioridad */}
          <div className="mb-6 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Prioridad
            </label>
            <select
              value={prioridadFilter}
              onChange={e => setPrioridadFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="">Todas las prioridades</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
          </div>

          {/* Estado de carga/error */}
          <LoadingState 
            loading={loading} 
            error={error} 
            empty={!loading && !error && requests.length === 0}
            emptyMessage="No hay solicitudes pendientes de registro."
            onRetry={fetchExternalRequests}
          />

          {/* Tabla de solicitudes externas */}
          {!loading && !error && requests.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Título</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ubicación</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Creado Por</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Prioridad</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((request) => (
                    <tr 
                      key={request.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{request.id}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{request.titulo}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{request.tipo}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{request.ubicacion}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(request.estado)}`}>
                          {request.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{request.creadoPor}</td>
                      <td className="py-3 px-4">
                        {request.prioridad ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.prioridad)}`}>
                            {request.prioridad}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Sin asignar</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ActionMenu request={request} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-sm text-gray-600">
                Mostrando {paginatedRequests.length} de {requests.length} solicitudes pendientes de registro
              </div>
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
          )}
        </div>

        {/* ...eliminar botón de volver... */}
      </main>

      {/* Modal de confirmación */}
      <ModalConfirmExternalRequest
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmRegister}
        request={selectedRequest}
        loading={registering}
      />
      </div>
    </Layout>
  );
}
