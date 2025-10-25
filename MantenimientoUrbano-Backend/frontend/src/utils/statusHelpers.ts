import type { EstadoSolicitud, Prioridad, EstadoFinanciamiento } from '../types';

/**
 * Mapea el estado de solicitud a un color para el badge
 */
export const getStatusColor = (status: EstadoSolicitud): string => {
  const colors: Record<EstadoSolicitud, string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    PROGRAMADA: 'bg-blue-100 text-blue-800',
    EN_PROGRESO: 'bg-purple-100 text-purple-800',
    FINALIZADA: 'bg-green-100 text-green-800',
    CANCELADA: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Mapea el estado de solicitud a texto en español
 */
export const getStatusText = (status: EstadoSolicitud): string => {
  const texts: Record<EstadoSolicitud, string> = {
    PENDIENTE: 'Pendiente',
    PROGRAMADA: 'Programada',
    EN_PROGRESO: 'En Progreso',
    FINALIZADA: 'Finalizada',
    CANCELADA: 'Cancelada',
  };
  return texts[status] || status;
};

/**
 * Mapea la prioridad a un color para el badge
 */
export const getPriorityColor = (priority: Prioridad): string => {
  const colors: Record<Prioridad, string> = {
    BAJA: 'bg-green-100 text-green-800',
    MEDIA: 'bg-yellow-100 text-yellow-800',
    ALTA: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

/**
 * Mapea la prioridad a texto en español
 */
export const getPriorityText = (priority: Prioridad): string => {
  const texts: Record<Prioridad, string> = {
    BAJA: 'Baja',
    MEDIA: 'Media',
    ALTA: 'Alta',
  };
  return texts[priority] || priority;
};

/**
 * Mapea el estado financiero a un color para el badge
 */
export const getFinancialStatusColor = (status: EstadoFinanciamiento): string => {
  const colors: Record<EstadoFinanciamiento, string> = {
    APROBADO: 'bg-green-100 text-green-800',
    RECHAZADO: 'bg-red-100 text-red-800',
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_ESPERA_FINANCIAMIENTO: 'bg-orange-100 text-orange-800',
    FINANCIADA: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Mapea el estado financiero a texto en español
 */
export const getFinancialStatusText = (status: EstadoFinanciamiento): string => {
  const texts: Record<EstadoFinanciamiento, string> = {
    APROBADO: 'Aprobado',
    RECHAZADO: 'Rechazado',
    PENDIENTE: 'Pendiente',
    EN_ESPERA_FINANCIAMIENTO: 'En Espera de Financiamiento',
    FINANCIADA: 'Financiada',
  };
  return texts[status] || status;
};
