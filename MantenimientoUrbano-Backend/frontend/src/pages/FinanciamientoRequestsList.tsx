import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Header from '../components/Header';
import Layout from '../components/Layout';
import RequestsTable from '../components/RequestsTable';
import LoadingState from '../components/LoadingState';
import { financiamientoService } from '../api/financiamientoService';
import { mapApiRequestsToRequests } from '../utils/mappers';
import apiClient from '../api/axios';
import type { Request } from '../types';

export default function FinanciamientoRequestsList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [rawResponse, setRawResponse] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [httpErrorDetails, setHttpErrorDetails] = useState<string | null>(null);
  const [lastRequestInfo, setLastRequestInfo] = useState<{ url: string; status?: number | null; ok?: boolean; message?: string } | null>(null);
  const [showRaw, setShowRaw] = useState<boolean>(false);

  // Filtros simples (estado, prioridad)
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [prioridadFilter, setPrioridadFilter] = useState<string>('');

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setHttpErrorDetails(null);
    setLastRequestInfo(null);
    try {
      const response: unknown = await financiamientoService.getAllFinancingRequests();
      setLastRequestInfo({ url: `${apiClient.defaults.baseURL}/mantenimiento/solicitudes/financiamiento/todas`, status: 200, ok: true });
      // Guardar la respuesta raw para depuración
      setRawResponse(response);

      // La API puede devolver directamente un array de solicitudes o un objeto { data: [...] }
      let payload: unknown[] = [];
      if (Array.isArray(response)) {
        payload = response as unknown[];
      } else if (response && typeof response === 'object') {
        // Caso común: { data: [...] }
        const respObj = response as Record<string, unknown>;
        const maybeData = (respObj as { data?: unknown }).data;
        if (Array.isArray(maybeData)) {
          payload = maybeData as unknown[];
        } else {
          // Si es un objeto con claves que contienen arrays (p.ej. agrupado por estado): extraer y aplanar
          const arrays = Object.values(respObj).filter((v): v is unknown[] => Array.isArray(v));
          if (arrays.length > 0) {
            payload = ([] as unknown[]).concat(...arrays);
          } else {
            // Si es un único objeto (una sola solicitud), envolver en array
            payload = [response];
          }
        }
      }

      const mapped = mapApiRequestsToRequests(payload ?? []);
      // Mostrar solo las solicitudes que fueron enviadas a finanzas y que están PENDIENTE o CANCELADA
      const desired = mapped.filter((r) => r.status === 'PENDIENTE' || r.status === 'CANCELADA');
      setRequests(desired);
    } catch (err: unknown) {
      console.error('Error al cargar solicitudes de financiamiento', err);
      // Si es un error de Axios, extraer detalles si están disponibles
      const maybeAxiosError = err as { response?: { status?: number; data?: unknown } };
      if (maybeAxiosError?.response) {
        const status = maybeAxiosError.response.status;
        const data = maybeAxiosError.response.data;
        // Guardar detalles en estado para depuración (serializados)
        let detailStr: string;
        try {
          detailStr = JSON.stringify({ status, data }, null, 2);
        } catch {
          detailStr = `status: ${String(status)}, data: ${String(data)}`;
        }
        setHttpErrorDetails(detailStr);

        // Extraer un mensaje legible desde `data` sin usar `any`
        let messageFromData = 'HTTP error';
        if (data !== undefined && data !== null) {
          if (typeof data === 'string') {
            messageFromData = data;
          } else if (typeof data === 'object') {
            const obj = data as Record<string, unknown>;
            const candidate = obj.message ?? obj.msg ?? obj.mensaje;
            if (typeof candidate === 'string') {
              messageFromData = candidate;
            } else {
              try {
                messageFromData = JSON.stringify(data);
              } catch {
                messageFromData = String(data);
              }
            }
          } else {
            messageFromData = String(data);
          }
        }

        setLastRequestInfo({ url: `${apiClient.defaults.baseURL}/mantenimiento/solicitudes/financiamiento/todas`, status, ok: false, message: messageFromData });
        setError(`Error ${status} al solicitar datos de financiamiento`);
      } else {
        setLastRequestInfo({ url: `${apiClient.defaults.baseURL}/mantenimiento/solicitudes/financiamiento/todas`, status: null, ok: false, message: String(err ?? 'Unknown error') });
        setError('No se pudo cargar las solicitudes de financiamiento.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Aplicar filtros
  const filteredRequests = requests.filter((r) =>
    (!estadoFilter || r.status === estadoFilter) && (!prioridadFilter || r.priority === prioridadFilter)
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    // Reiniciar paginación cuando filtros cambian
    setCurrentPage(1);
  }, [estadoFilter, prioridadFilter]);

  // Sanitizar valores `unknown` para renderizar en JSX (evitar TS2322)
  const rawResponseString = rawResponse !== null && rawResponse !== undefined
    ? (() => {
        try { return JSON.stringify(rawResponse, null, 2); } catch { return String(rawResponse); }
      })()
    : '';

  const httpErrorDetailsString = httpErrorDetails ?? '';

  return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <Header title="Solicitudes a Finanzas" showSearch={false} />

          <main className="max-w-7xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="text-blue-700" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Solicitudes enviadas a Finanzas</h2>
              </div>

              <div className="mb-6 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Estado</label>
                  <select
                      value={estadoFilter}
                      onChange={(e) => setEstadoFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Todos</option>
                    <option value="PENDIENTE">Enviadas</option>
                    <option value="CANCELADA">Canceladas</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Prioridad</label>
                  <select
                      value={prioridadFilter}
                      onChange={(e) => setPrioridadFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Todas las prioridades</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                      onClick={() => fetchData()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                  >
                    Refrescar
                  </button>
                  <div className="ml-3">
                    <button
                        onClick={() => fetchData()}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium shadow-sm"
                    >
                      Probar endpoint
                    </button>
                  </div>
                </div>
              </div>

              <LoadingState
                  loading={loading}
                  error={error}
                  empty={!loading && !error && filteredRequests.length === 0}
                  emptyMessage="No hay solicitudes enviadas a finanzas."
                  onRetry={fetchData}
              />

              {/* Depuración opcional: botón para mostrar respuesta cruda y detalles */}
              {!loading && !error && Boolean(rawResponse) && (
                  <div className="mt-4">
                    <button
                        onClick={() => setShowRaw((s) => !s)}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                    >
                      {showRaw ? 'Ocultar respuesta cruda' : 'Mostrar respuesta cruda'}
                    </button>
                  </div>
              )}

              {showRaw && Boolean(rawResponse) && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
                    <h4 className="font-medium text-gray-800 mb-2">Depuración</h4>
                    <pre className="max-h-60 overflow-auto text-xs bg-white p-3 border rounded text-gray-700">
                  {rawResponseString || 'Sin respuesta del servidor.'}
                </pre>
                    {Boolean(httpErrorDetails) && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                          <strong>Detalles HTTP:</strong>
                          <pre className="text-xs mt-2">{httpErrorDetailsString}</pre>
                        </div>
                    )}
                    {lastRequestInfo && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-700">
                          <strong>Última petición:</strong>
                          <div className="mt-2 text-xs">URL: <code>{lastRequestInfo.url}</code></div>
                          <div className="mt-1 text-xs">Estado: {lastRequestInfo.status ?? 'N/A'}</div>
                          <div className="mt-1 text-xs">Mensaje: {lastRequestInfo.message ?? (lastRequestInfo.ok ? 'OK' : 'No disponible')}</div>
                        </div>
                    )}
                  </div>
              )}

              {!loading && !error && filteredRequests.length > 0 && (
                  <>
                    <RequestsTable
                        requests={paginatedRequests}
                        variant="full"
                        showFinancialStatus={true}
                        showActions={true}
                        showFinancingButton={false}
                        onProgramRequest={(id) => navigate(`/programar/${id}`)}
                    />

                    <div className="mt-4 text-sm text-gray-600">
                      Mostrando {Math.min(filteredRequests.length, (currentPage - 1) * itemsPerPage + 1)}-
                      {Math.min(filteredRequests.length, currentPage * itemsPerPage)} de {filteredRequests.length} resultados
                    </div>

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
                  </>
              )}
            </div>
          </main>
        </div>
      </Layout>
  );
}
