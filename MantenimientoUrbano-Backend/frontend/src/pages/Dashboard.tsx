import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import LoadingState from '../components/LoadingState';
import { useRequestsData } from '../hooks/useRequestsData';

const COLORS = {
  ALTA: '#ef4444',    // rojo
  MEDIA: '#f59e0b',   // amarillo
  BAJA: '#10b981',    // verde
  PENDIENTE: '#94a3b8',    // gris
  PROGRAMADA: '#3b82f6',   // azul
  FINALIZADA: '#10b981',   // verde
  CANCELADA: '#6b7280',    // gris oscuro
  EN_PROGRESO: '#8b5cf6', // púrpura
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Hook personalizado para manejar datos de solicitudes
  const { requests, loading, error, refetch } = useRequestsData({ onlyPending: false });

  // Calcular estadísticas
  const stats = {
    pending: requests.filter(r => r.status === 'PENDIENTE').length,
    scheduled: requests.filter(r => r.status === 'PROGRAMADA').length,
    completed: requests.filter(r => r.status === 'FINALIZADA').length,
    financed: requests.filter(r => r.financialStatus === 'FINANCIADA').length,
  };

  // Datos para gráficos
  const priorityData = [
    {
      name: 'Alta',
      value: requests.filter(r => r.priority === 'ALTA').length,
      fill: COLORS.ALTA
    },
    {
      name: 'Media',
      value: requests.filter(r => r.priority === 'MEDIA').length,
      fill: COLORS.MEDIA
    },
    {
      name: 'Baja',
      value: requests.filter(r => r.priority === 'BAJA').length,
      fill: COLORS.BAJA
    },
  ].filter(item => item.value > 0);

  const statusData = [
    {
      name: 'Pendiente',
      value: requests.filter(r => r.status === 'PENDIENTE').length,
      fill: COLORS.PENDIENTE
    },
    {
      name: 'Programada',
      value: requests.filter(r => r.status === 'PROGRAMADA').length,
      fill: COLORS.PROGRAMADA
    },
    {
      name: 'En Progreso',
      value: requests.filter(r => r.status === 'EN_PROGRESO').length,
      fill: COLORS.EN_PROGRESO
    },
    {
      name: 'Finalizada',
      value: requests.filter(r => r.status === 'FINALIZADA').length,
      fill: COLORS.FINALIZADA
    },
    {
      name: 'Cancelada',
      value: requests.filter(r => r.status === 'CANCELADA').length,
      fill: COLORS.CANCELADA
    },
    {
      name: 'Financiada',
      value: requests.filter(r => r.financialStatus === 'FINANCIADA').length,
      fill: '#22d3ee' // color celeste para distinguir
    },
  ].filter(item => item.value > 0);

  return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <Header
              title="Mantenimiento Urbano"
              showSearch={false}
              username="username"
          />

          <main className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

            {/* Estado de carga/error */}
            {loading || error ? (
                <LoadingState
                    loading={loading}
                    error={error}
                    onRetry={() => refetch()}
                />
            ) : (
                <>
                  {/* Cards de métricas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Pendientes"
                        value={stats.pending}
                        color="orange"
                        info="Solicitudes que aún no han sido atendidas ni programadas."
                    />
                    <StatsCard
                        title="Programadas"
                        value={stats.scheduled}
                        color="blue"
                        info="Solicitudes que ya tienen fecha y cuadrilla asignada."
                    />
                    <StatsCard
                        title="Financiadas"
                        value={stats.financed}
                        color="green"
                        info="Solicitudes que ya han sido financiadas."
                    />
                  </div>

                  {/* Botones de navegación */}
                  <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => navigate('/solicitudes')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                    >
                      Ver Todas las Solicitudes
                    </button>

                    <button
                        onClick={() => navigate('/solicitudes-externas')}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
                    >
                      Solicitudes Recibidas
                    </button>

                    <button
                        onClick={() => navigate('/financiamiento/todas')}
                        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-sm"
                    >
                      Solicitudes a Finanzas
                    </button>
                  </div>

                  {/* Gráficos */}
                  {requests.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                          Estadísticas Visuales
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                          {/* Gráfico de Prioridad */}
                          {priorityData.length > 0 && (
                              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                  Distribución por Prioridad
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                  <PieChart>
                                    <Pie
                                        data={priorityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                      {priorityData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                          )}

                          {/* Gráfico de Estado */}
                          {statusData.length > 0 && (
                              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                  Distribución por Estado
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                  <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Cantidad">
                                      {statusData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                          )}
                        </div>
                      </>
                  )}
                </>
            )}
          </main>
        </div>
      </Layout>
  );
}