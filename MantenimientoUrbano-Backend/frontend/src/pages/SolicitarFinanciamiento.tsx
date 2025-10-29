import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  financiamientoService,
  type FinancingRequestPayload,
} from "../api/financiamientoService";
import { useRequestById } from "../hooks/useRequestById";
import Layout from "../components/Layout";
import RequestDetailsCard from "../components/RequestDetailsCard";
import LoadingState from "../components/LoadingState";
import { DollarSign, ArrowLeft } from "lucide-react";
import { toastPromise, showWarningToast, showErrorToast } from "../utils/toast";

const SolicitarFinanciamiento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const solicitudId = Number(id);

  // Hook para cargar los detalles de   la solicitud
  const {
    request,
    loading: loadingRequest,
    error: errorRequest,
  } = useRequestById(solicitudId);

  const today = new Date().toISOString().slice(0, 10);
  const [montoEstimado, setMontoEstimado] = useState("");
  const [email, setEmail] = useState("");
  const [requestDate, setRequestDate] = useState(today);
  const [submitting, setSubmitting] = useState(false);
  const [montoError, setMontoError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false); // Para saber si el usuario ya interactuó
  const [montoTouched, setMontoTouched] = useState(false);

  // Validar email
  const isValidEmail = (email: string): boolean => {
    if (!email) return true; // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar cambio de monto (sin validación en tiempo real)
  const handleMontoChange = (value: string) => {
    setMontoEstimado(value);
    // Solo validar si el usuario ya había perdido el foco antes
    if (montoTouched && value) {
      const monto = parseFloat(value);
      setMontoError(isNaN(monto) || monto <= 0);
    } else {
      setMontoError(false);
    }
  };

  // Validar monto cuando pierde el foco
  const handleMontoBlur = () => {
    setMontoTouched(true);
    if (montoEstimado) {
      const monto = parseFloat(montoEstimado);
      setMontoError(isNaN(monto) || monto <= 0);
    }
  };

  // Manejar cambio de email (sin validación en tiempo real)
  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Solo validar si el usuario ya había perdido el foco antes
    if (emailTouched && value) {
      setEmailError(!isValidEmail(value));
    } else {
      setEmailError(false);
    }
  };

  // Validar email cuando pierde el foco (onBlur)
  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email) {
      setEmailError(!isValidEmail(email));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación: Monto debe ser numérico y mayor a 0
    const monto = parseFloat(montoEstimado);
    if (!montoEstimado || isNaN(monto) || monto <= 0) {
      setMontoError(true);
      showWarningToast("⚠️ El monto debe ser un número mayor a cero");
      return;
    }

    // Validación: Email debe ser válido si se proporciona
    if (email && !isValidEmail(email)) {
      setEmailError(true);
      showWarningToast("⚠️ Por favor ingresa un email válido");
      return;
    }

    if (!request) {
      showErrorToast("No se pudo cargar la solicitud.");
      return;
    }

    setSubmitting(true);

    try {
      // Mapear prioridad a ID (ajustar según tu backend)
      const priorityMap: Record<string, number> = {
        ALTA: 1,
        MEDIA: 2,
        BAJA: 3,
      };

      let priorityId: number;
      if (typeof request.priority === "number") {
        priorityId = request.priority;
      } else {
        priorityId = priorityMap[request.priority as string] || 0;
      }

      const payload: FinancingRequestPayload = {
        originId: 1, // ID fijo que mapea el sistema de Mantenimiento Urbano en el sistema de Financiamiento
        requestAmount: parseFloat(montoEstimado),
        name: "MANTENIMIENTO_URBANO",
        reason: request.description,
        requestDate: requestDate,
        email: email || undefined,
        priorityId,
      };

      console.log("Payload de financiamiento:", payload);
      console.log("ID de solicitud en ruta:", solicitudId);

      // Usar toastPromise para manejar el estado de la petición
      await toastPromise(
        financiamientoService.solicitarFinanciamientoAdvanced(
          solicitudId,
          payload
        ),
        {
          loading: "⏳ Enviando solicitud de financiamiento...",
          success: "✓ Solicitud de financiamiento enviada exitosamente",
          error: "✗ No se pudo enviar la solicitud de financiamiento",
        }
      );

      // Navegar después de éxito
      setTimeout(() => navigate("/solicitudes"), 1000);
    } catch (err) {
      console.error("Error al solicitar financiamiento:", err);
      // El toast ya maneja el error, no necesitamos setError
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
              Solicitar Financiamiento - Solicitud #{solicitudId}
            </h1>
            <button
              onClick={() => navigate("/solicitudes")}
              className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
            >
              <ArrowLeft className="mr-2" /> Volver a Solicitudes
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="max-w-4xl mx-auto mt-8 space-y-6 px-4">
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

              {/* Formulario de financiamiento */}
              <div className="bg-white p-8 rounded-2xl shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Detalles del Financiamiento
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Estimado (Q) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={montoEstimado}
                      onChange={(e) => handleMontoChange(e.target.value)}
                      onBlur={handleMontoBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
                        montoError
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                      placeholder="Ingresa el monto en quetzales"
                      min={0.01}
                      step={0.01}
                      disabled={submitting}
                      required
                    />
                    {montoError && (
                      <p className="mt-1 text-sm text-red-600">
                        El monto debe ser un número mayor a cero
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de la solicitud
                    </label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      min={today}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de contacto (opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={handleEmailBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
                        emailError
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                      placeholder="operador@municipio.com"
                      disabled={submitting}
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600">
                        Por favor ingresa un email válido
                      </p>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/solicitudes")}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
                      disabled={submitting}
                    >
                      {submitting ? "Enviando..." : "Solicitar Financiamiento"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default SolicitarFinanciamiento;
