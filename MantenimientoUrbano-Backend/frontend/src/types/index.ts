// Tipos para las entidades del sistema

// Enums que reflejan los del backend
export type EstadoSolicitud = 'PENDIENTE' | 'PROGRAMADA' | 'EN_PROGRESO' | 'FINALIZADA' | 'CANCELADA';
export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA';
export type EstadoFinanciamiento = 'APROBADO' | 'RECHAZADO' | 'PENDIENTE' | 'EN_ESPERA_FINANCIAMIENTO' | 'FINANCIADA';
export type FuenteSolicitud = 'CIUDADANO' | 'PARTICIPACION_CIUDADANA' | 'INTERNO';

// Tipos para la respuesta de la API (coincide exactamente con el backend)
export interface ApiRequest {
  id: number;
  tipo: string;
  descripcion: string;
  ubicacion: string;
  prioridad: Prioridad;
  estado: EstadoSolicitud;
  fechaRegistro: string;
  fuente: FuenteSolicitud;
  reporteIdExtern: number;
  estadoFinanciero: EstadoFinanciamiento;
  idFinanciamiento: number | null;
  fechaProgramada: string | null;
  cuadrillaAsignada: string | null;
  recursosAsignados: string[] | null;
}

// Tipo para uso interno en la UI (mantiene compatibilidad con componentes existentes)
export interface Request {
  id: number;
  tipo: string;
  location: string;
  description: string;
  status: EstadoSolicitud;
  priority: Prioridad;
  date: string;
  source: FuenteSolicitud;
  externalReportId: number;
  financialStatus: EstadoFinanciamiento;
  financingId: number | null;
  scheduledDate: string | null;
  assignedCrew: string | null;
  assignedResources: string[] | null;
}

export interface Stats {
  pending: number;
  scheduled: number;
  completed: number;
}

export interface User {
  username: string;
  avatar?: string;
}
