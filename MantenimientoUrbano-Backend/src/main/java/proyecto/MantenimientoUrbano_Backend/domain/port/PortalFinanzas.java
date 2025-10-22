package proyecto.MantenimientoUrbano_Backend.domain.port;

import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoRequest;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoResponse;

public interface PortalFinanzas {
    SolicitudFinanciamientoResponse solicitarFinanciamiento(SolicitudFinanciamientoRequest request);
    EstadoFinanciamiento consultarEstadoFinanciero(Long idFinanciamiento);
}