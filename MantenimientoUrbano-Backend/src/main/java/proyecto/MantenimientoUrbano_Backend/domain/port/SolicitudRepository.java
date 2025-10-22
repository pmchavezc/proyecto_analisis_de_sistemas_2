package proyecto.MantenimientoUrbano_Backend.domain.port;

import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;

import java.util.List;
import java.util.Optional;

public interface SolicitudRepository {
    SolicitudMantenimiento save(SolicitudMantenimiento solicitud);
    Optional<SolicitudMantenimiento> findById(Long id);
    List<SolicitudMantenimiento> findPendientesOrdenadas();
    List<SolicitudMantenimiento> findTodasOrdenadas();
    void actualizarEstadoFinanciero(Long idSolicitud, EstadoFinanciamiento estado, Long idFinanciamiento);

}