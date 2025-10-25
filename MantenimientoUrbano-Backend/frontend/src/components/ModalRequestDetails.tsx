import { MapPin, Calendar, DollarSign, Users, Package } from 'lucide-react';
import type { Request } from '../types';
import {
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
  getFinancialStatusColor,
  getFinancialStatusText,
} from '../utils/statusHelpers';
import BaseModal from './BaseModal';

interface ModalRequestDetailsProps {
  request: Request;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalRequestDetails({ request, isOpen, onClose }: ModalRequestDetailsProps) {
  if (!isOpen) return null;

  // Determinar si la solicitud viene de Participación Ciudadana
  const esDeParticipacionCiudadana = request.source === 'PARTICIPACION_CIUDADANA' || request.externalReportId > 0;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <>
        {/* Header */}
        <div className="text-center pt-6 px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Detalles de Solicitud #{request.id}
          </h2>
          <p className="text-gray-600 text-sm">
            Información completa del registro
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Información General */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              Información General
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo de Solicitud</p>
                    <p className="text-sm font-semibold text-gray-800">{request.tipo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha de Registro</p>
                    <p className="text-sm font-semibold text-gray-800">{request.date}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ubicación</p>
                  <p className="text-sm font-semibold text-gray-800">{request.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                <Calendar className="text-gray-600 mt-0.5 flex-shrink-0" size={18} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Descripción</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{request.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prioridad</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {getPriorityText(request.priority)}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Información Financiera */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign className="text-green-600" size={20} />
              Información Financiera
            </h3>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 space-y-3 border border-green-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estado Financiero</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getFinancialStatusColor(request.financialStatus)}`}>
                      {getFinancialStatusText(request.financialStatus)}
                    </span>
                  </div>
                </div>
                {request.financialStatus !== 'PENDIENTE' && request.financialStatus !== 'EN_ESPERA_FINANCIAMIENTO' && (
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID Financiamiento</p>
                      <p className="text-sm font-semibold text-gray-800">{request.financingId || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Programación (si está programada) */}
          {(request.status === 'PROGRAMADA' || request.status === 'EN_PROGRESO' || request.status === 'FINALIZADA') && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="text-purple-600" size={20} />
                Programación
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 space-y-3 border border-purple-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-purple-600 mt-0.5 flex-shrink-0" size={18} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha Programada</p>
                      <p className="text-sm font-semibold text-gray-800">{request.scheduledDate || 'No programada'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="text-purple-600 mt-0.5 flex-shrink-0" size={18} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cuadrilla Asignada</p>
                      <p className="text-sm font-semibold text-gray-800">{request.assignedCrew || 'No asignada'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Recursos Asignados (si están disponibles) */}
          {(request.status === 'PROGRAMADA' || request.status === 'EN_PROGRESO' || request.status === 'FINALIZADA') && request.assignedResources && request.assignedResources.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Package className="text-orange-600" size={20} />
                Recursos Asignados
              </h3>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 shadow-sm">
                <ul className="space-y-2">
                  {request.assignedResources.map((resource, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></span>
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Fuente de la Solicitud */}
          {esDeParticipacionCiudadana && (
            <section>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Users className="text-indigo-600 mt-0.5 flex-shrink-0" size={18} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fuente de la Solicitud</p>
                      <p className="text-sm font-semibold text-gray-800">Participación Ciudadana</p>
                    </div>
                  </div>
                  {request.externalReportId > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID Externo</p>
                        <p className="text-sm font-semibold text-gray-800">{request.externalReportId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </>
    </BaseModal>
  );
}
