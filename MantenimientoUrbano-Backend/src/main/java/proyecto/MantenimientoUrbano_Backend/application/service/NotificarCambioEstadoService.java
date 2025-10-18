package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.application.dto.NotificacionEstadoDTO;
import proyecto.MantenimientoUrbano_Backend.application.usecase.NotificarCambioEstadoUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.ParticipacionGateway;

import java.time.LocalDate;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NotificarCambioEstadoService implements NotificarCambioEstadoUseCase {

    private final ParticipacionGateway gateway;

    private static final Set<EstadoSolicitud> ESTADOS_OPERATIVOS_NOTIFICABLES = Set.of(
            EstadoSolicitud.PROGRAMADA,
            EstadoSolicitud.COMPLETADA
    );

    private static final Set<EstadoFinanciamiento> ESTADOS_FINANCIEROS_NOTIFICABLES = Set.of(
            EstadoFinanciamiento.APROBADO,
            EstadoFinanciamiento.FINANCIADA
    );

    @Override
    public void notificarSiAplica(SolicitudMantenimiento solicitud) {
        boolean estadoOperativoValido = ESTADOS_OPERATIVOS_NOTIFICABLES.contains(solicitud.getEstado());
        boolean estadoFinancieroValido = ESTADOS_FINANCIEROS_NOTIFICABLES.contains(solicitud.getEstadoFinanciero());

        if (estadoOperativoValido || estadoFinancieroValido) {
            NotificacionEstadoDTO notificacion = NotificacionEstadoDTO.builder()
                    .idSolicitud(solicitud.getId())
                    .estado(solicitud.getEstado())
                    .fechaModificacion(LocalDate.now())
                    .build();

            gateway.enviarNotificacion(notificacion);
        }
    }
}


