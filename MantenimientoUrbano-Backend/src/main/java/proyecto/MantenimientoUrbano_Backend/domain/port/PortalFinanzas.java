package proyecto.MantenimientoUrbano_Backend.domain.port;

import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoRequest;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoResponse;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.SolicitudFinancieraDTO;

import java.util.List;

public interface PortalFinanzas {
    SolicitudFinanciamientoResponse solicitarFinanciamiento(SolicitudFinanciamientoRequest request);
    EstadoFinanciamiento consultarEstadoFinanciero(Long idFinanciamiento);
    List<SolicitudFinancieraDTO> obtenerSolicitudes();
}