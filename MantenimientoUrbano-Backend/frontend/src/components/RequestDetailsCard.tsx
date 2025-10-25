import { MapPin, Calendar, FileText, AlertTriangle } from 'lucide-react';
import type { Request } from '../types';
import {
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
} from '../utils/statusHelpers';

interface RequestDetailsCardProps {
  request: Request;
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Componente reutilizable para mostrar detalles de una solicitud
 * Presenta información clave de forma visual y organizada
 * 
 * @param request - La solicitud a mostrar
 * @param variant - 'compact' para menos detalles, 'full' para todo
 * @param className - Clases CSS adicionales
 */
export default function RequestDetailsCard({ 
  request, 
  variant = 'full',
  className = '' 
}: RequestDetailsCardProps) {
  return (
    <div className={`bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-xl p-6 border border-green-200 shadow-sm ${className}`}>
      {/* Título con ID */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
          <FileText className="text-white" size={22} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">
            Solicitud #{request.id}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{request.tipo}</p>
          <p className="text-xs text-gray-500 mt-1">ID Externo: {request.externalReportId}</p>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Ubicación */}
        <div className="flex items-start gap-3 p-3">
          <MapPin className="text-green-600 mt-1 flex-shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ubicación</p>
            <p className="text-sm font-semibold text-gray-800">{request.location}</p>
          </div>
        </div>

        {/* Fecha */}
        <div className="flex items-start gap-3 p-3">
          <Calendar className="text-green-600 mt-1 flex-shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Fecha de registro</p>
            <p className="text-sm font-semibold text-gray-800">{request.date}</p>
          </div>
        </div>

        {/* Prioridad */}
        <div className="flex items-start gap-3 p-3">
          <AlertTriangle className="text-green-600 mt-1 flex-shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Prioridad</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}>
              {getPriorityText(request.priority)}
            </span>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-start gap-3 p-3">
          <div className="mt-1">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(request.status)} shadow-sm`}></div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Estado</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
              {getStatusText(request.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Descripción (solo en variant full) */}
      {variant === 'full' && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-start gap-3">
            <FileText className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-sm text-gray-700 leading-relaxed">{request.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
