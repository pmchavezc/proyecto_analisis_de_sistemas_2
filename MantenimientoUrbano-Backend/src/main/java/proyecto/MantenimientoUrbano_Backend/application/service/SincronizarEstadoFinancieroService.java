package proyecto.MantenimientoUrbano_Backend.application.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.PortalFinanzas;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

@Service
@RequiredArgsConstructor
public class SincronizarEstadoFinancieroService {

    private final PortalFinanzas portalFinanzas;
    private final SolicitudRepository solicitudRepository;

    public void sincronizarEstado(Long idSolicitud) {
        SolicitudMantenimiento solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        Long idFinanciamiento = solicitud.getIdFinanciamiento();
        if (idFinanciamiento == null) {
            throw new IllegalStateException("La solicitud no tiene financiamiento asociado");
        }

        EstadoFinanciamiento nuevoEstado = portalFinanzas.consultarEstadoFinanciero(idFinanciamiento);

        solicitudRepository.actualizarEstadoFinanciero(idSolicitud, nuevoEstado, idFinanciamiento);
    }
}
