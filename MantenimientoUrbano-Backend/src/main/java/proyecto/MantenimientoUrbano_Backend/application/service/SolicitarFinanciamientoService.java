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
    public SolicitudFinanciamientoResponse solicitarFinanciamiento(SolicitudFinanciamientoRequest request, Long solicitudId) {
        SolicitudMantenimiento solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        if (!solicitud.getEstado().equals(EstadoSolicitud.PROGRAMADA)) {
            throw new IllegalStateException("Solo se puede solicitar financiamiento si la solicitud está programada");
        }

        SolicitudFinanciamientoResponse respuesta = portalFinanzas.solicitarFinanciamiento(request);

        solicitudRepository.actualizarEstadoFinanciero(
                solicitud.getId(),
                respuesta.getEstado() == EstadoFinanciamiento.APROBADO
                        ? EstadoFinanciamiento.FINANCIADA
                        : EstadoFinanciamiento.EN_ESPERA_FINANCIAMIENTO,
                Long.parseLong(respuesta.getIdTransaccion())
        );
        return respuesta;
    }

}