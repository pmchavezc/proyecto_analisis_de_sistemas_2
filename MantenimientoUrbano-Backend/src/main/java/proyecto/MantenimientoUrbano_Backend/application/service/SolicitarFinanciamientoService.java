package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.application.usecase.SolicitarFinanciamientoUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.*;
import proyecto.MantenimientoUrbano_Backend.domain.port.PortalFinanzas;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

@Service
@RequiredArgsConstructor
public class SolicitarFinanciamientoService implements SolicitarFinanciamientoUseCase {

    private final PortalFinanzas portalFinanzas;
    private final SolicitudRepository solicitudRepository;


    @Override
    public SolicitudFinanciamientoResponse solicitarFinanciamiento(SolicitudFinanciamientoRequest request) {
        SolicitudMantenimiento solicitud = solicitudRepository.findById(request.getIdSolicitud())
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        if (!solicitud.getEstado().equals(EstadoSolicitud.PROGRAMADA)) {
            throw new IllegalStateException("Solo se puede solicitar financiamiento si la solicitud está programada");
        }

        SolicitudFinanciamientoResponse respuesta = portalFinanzas.solicitarFinanciamiento(request);

        solicitud.setEstadoFinanciero(EstadoFinanciamiento.valueOf(respuesta.getEstado() == EstadoFinanciamiento.APROBADO
                ? "FINANCIADA"
                : "EN_ESPERA_FINANCIAMIENTO"));

        solicitudRepository.save(solicitud);

        return respuesta;
    }
}