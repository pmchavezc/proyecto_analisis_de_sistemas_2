import type { Request, EstadoSolicitud, Prioridad, EstadoFinanciamiento } from '../types';

/**
 * Intenta obtener un campo de varias posibles claves
 */
const pick = (obj: any, ...keys: string[]) => {
  for (const k of keys) {
    if (obj == null) continue;
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) return obj[k];
  }
  return undefined;
};

/**
 * Convierte cualquier objeto recibido del backend a nuestro tipo `Request` lo mejor posible.
 */
export const mapAnyToRequest = (item: any): Request => {
  const id = pick(item, 'id', 'requestId', 'request_id', 'idSolicitud', 'solicitudId') ?? 0;
  const tipo = pick(item, 'tipo', 'type', 'name', 'nombre', 'originNombre') ?? String(pick(item, 'tipo', 'type', 'name', 'nombre', 'descripcion', 'description') ?? 'Solicitud');
  const location = pick(item, 'ubicacion', 'location', 'direccion', 'address') ?? '';
  const description = pick(item, 'descripcion', 'description', 'desc', 'detalle', 'reason') ?? '';

  // Prioridad y estado - normalizar a los tipos esperados cuando sea posible
  const prioridadRaw = (pick(item, 'prioridad', 'priority', 'priorityId', 'prioridadId', 'priorityNombre') ?? 'MEDIA') as string;
  const estadoRaw = (pick(item, 'estado', 'status', 'estadoSolicitud', 'requestStatusNombre') ?? 'PENDIENTE') as string;
  const estadoFinancieroRaw = (pick(item, 'estadoFinanciero', 'financialStatus', 'estado_financiero') ?? 'PENDIENTE') as string;

  const mapPriority = (p: string): Prioridad => {
    const up = String(p ?? '').toUpperCase();
    if (up.includes('ALTA')) return 'ALTA';
    if (up.includes('BAJA')) return 'BAJA';
    return 'MEDIA';
  };

  const mapEstado = (s: string): EstadoSolicitud => {
    const up = String(s ?? '').toUpperCase();
    if (up.includes('PROGRAM')) return 'PROGRAMADA';
    if (up.includes('EN_PROGRESO') || up.includes('EN PROGRESO')) return 'EN_PROGRESO';
    if (up.includes('FINAL')) return 'FINALIZADA';
    if (up.includes('CANCEL')) return 'CANCELADA';
    return 'PENDIENTE';
  };

  const mapEstadoFin = (s: string): EstadoFinanciamiento => {
    const up = String(s ?? '').toUpperCase();
    if (up.includes('APROB')) return 'APROBADO';
    if (up.includes('RECHAZ')) return 'RECHAZADO';
    if (up.includes('FINANCIADA')) return 'FINANCIADA';
    if (up.includes('ESPERA') || up.includes('EN_ESPERA')) return 'EN_ESPERA_FINANCIAMIENTO';
    return 'PENDIENTE';
  };

  const date = pick(item, 'fechaRegistro', 'fecha_registro', 'date', 'createdAt', 'fecha', 'approvedDate') ?? '';
  const source = pick(item, 'fuente', 'source') ?? 'INTERNO';
  const externalReportId = pick(item, 'reporteIdExtern', 'externalReportId', 'reporte_id', 'reportId') ?? 0;
  const financingId = pick(item, 'idFinanciamiento', 'financingId', 'id_financiamiento', 'financiamiento_id') ?? null;
  const scheduledDate = pick(item, 'fechaProgramada', 'scheduledDate', 'scheduled_at') ?? null;
  const assignedCrew = pick(item, 'cuadrillaAsignada', 'assignedCrew', 'cuadrilla') ?? null;
  const assignedResources = pick(item, 'recursosAsignados', 'assignedResources', 'recursos') ?? null;
  const requestAmount = pick(item, 'requestAmount', 'request_amount', 'monto', 'requestAmount') ?? null;

  // Construir descripción final (añadir monto si existe)
  const finalDescription = requestAmount ? `${String(description)}\nMonto: ${requestAmount}` : String(description);

  return {
    id: Number(id),
    tipo: String(tipo),
    location: String(location),
    status: mapEstado(estadoRaw),
    priority: mapPriority(prioridadRaw),
    date: String(date),
    source: source as any,
    externalReportId: Number(externalReportId ?? 0),
    financialStatus: mapEstadoFin(estadoFinancieroRaw),
    financingId: financingId === null ? null : Number(financingId),
    scheduledDate: scheduledDate ?? null,
    assignedCrew: assignedCrew ?? null,
    assignedResources: Array.isArray(assignedResources) ? assignedResources : (assignedResources ? [assignedResources] : null),
    // Información adicional del DTO de financiamiento (se conserva en description si existe)
    // Si hay monto de solicitud lo añadimos a la descripción para visibilidad
    description: finalDescription,
  };
};

/**
 * Transforma un array de solicitudes de la API (usa mapAnyToRequest para tolerancia)
 */
export const mapApiRequestsToRequests = (apiRequests: any[]): Request[] => {
  if (!Array.isArray(apiRequests)) return [];
  return apiRequests.map(mapAnyToRequest);
};
