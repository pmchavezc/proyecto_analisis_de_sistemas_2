import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestsService } from '../api/requestsService';
import { useRequestById } from '../hooks/useRequestById';
import Layout from '../components/Layout';
import RequestDetailsCard from '../components/RequestDetailsCard';
import LoadingState from '../components/LoadingState';
import { Calendar, ArrowLeft } from "lucide-react";
import { toastPromise, showWarningToast } from '../utils/toast';

const ProgramarSolicitud: React.FC = () => {
  const { id } = useParams<{ id: string }>(); //  Obtiene el ID de la URL (/programar/:id)
  const navigate = useNavigate(); //  Permite volver al dashboard o moverse entre rutas

  const solicitudId = Number(id); // Convertimos el id a número

  // Hook para cargar los detalles de la solicitud
  const { request, loading: loadingRequest, error: errorRequest } = useRequestById(solicitudId);

  const today = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState<string>(today);
  const [cuadrilla, setCuadrilla] = useState(""); 
  const [recursos, setRecursos] = useState("");
  const [submitting, setSubmitting] = useState(false); 

  const handleSubmit = async () => {
    if (!fecha || !cuadrilla || !recursos.trim()) {
      showWarningToast("⚠️ Por favor completa todos los campos requeridos");
      return;
    }

    // Convertir el textarea de recursos en un arreglo separado por comas
    const recursosArray = recursos
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const body = {
      fechaInicio: fecha,
      cuadrilla,
      recursos: recursosArray,
    };

    try {
      setSubmitting(true);
      
      // Usar toastPromise para manejar el estado de la petición
      await toastPromise(
        requestsService.programRequest(solicitudId, body),
        {
          loading: '⏳ Programando solicitud...',
          success: '✓ Solicitud programada correctamente',
          error: '✗ No se pudo programar la solicitud',
        }
      );
      
      // Navegar después de éxito
      setTimeout(() => navigate('/solicitudes'), 1000);
    } catch (err) {
      console.error('Error al programar la solicitud:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Encabezado */}
        <header className="bg-green-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
           <h1 className="text-2xl font-bold text-gray-800">
        Programar Solicitud #{solicitudId}
           </h1>
          <button
          onClick={() => navigate("/solicitudes")} 
          className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
            >
          <ArrowLeft className="mr-2" /> Volver a Solicitudes Pendientes
         </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto mt-8 space-y-6">
        {/* Estado de carga/error */}
        <LoadingState
          loading={loadingRequest}
          error={errorRequest}
          empty={!loadingRequest && !errorRequest && !request}
          emptyMessage="No se encontró la solicitud"
        />

        {/* Detalles de la solicitud */}
        {request && (
          <>
            <RequestDetailsCard request={request} variant="full" />

            {/* Formulario de programación */}
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Detalles de programación
              </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de mantenimiento
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <Calendar className="text-gray-400 mr-2" />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={today}
                className="w-full outline-none"
              />
            </div>
          </div>

         {/* -------------------- CAMPO CUADRILLA (Reemplaza a Responsable) -------------------- */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
        Cuadrilla asignada
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              {/* Aquí puedes usar un ícono de usuario o equipo */}
              <input
            type="text"
            placeholder="Ej: Cuadrilla Central A"
            value={cuadrilla}
            onChange={(e) => setCuadrilla(e.target.value)}
            className="w-full outline-none"
                     />
                  </div>
              </div>

{/* -------------------- CAMPO RECURSOS (Nuevo, según CU-03) -------------------- */}
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
        Recursos / Materiales <span className="text-red-500">*</span>
        </label>
         <textarea
         rows={3}
         placeholder="Ej: 5mts cable THHN, 1 caja de herramientas, Escalera de 6m"
         value={recursos}
          onChange={(e) => setRecursos(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
             />
          </div>

              </div>

            {/* Botones */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => navigate("/solicitudes")}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? 'Programando...' : 'Programar solicitud'}
              </button>
            </div>
          </div>
        </>
        )}
      </main>
      </div>
    </Layout>
  );
};

export default ProgramarSolicitud;
