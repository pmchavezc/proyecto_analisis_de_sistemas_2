package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.application.usecase.CambiarEstadoSolicitudUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CambiarEstadoSolicitudService implements CambiarEstadoSolicitudUseCase {
    private final SolicitudRepository solicitudRepository;

    @Override
    public void cambiarEstado(Long idSolicitud, EstadoSolicitud nuevoEstado) {
        var solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        List<EstadoSolicitud> estadosPermitidos = List.of(
                EstadoSolicitud.CANCELADA,
                EstadoSolicitud.FINALIZADA,
                EstadoSolicitud.COMPLETADA,
                EstadoSolicitud.PENDIENTE
        );

        if (!estadosPermitidos.contains(nuevoEstado)) {
            throw new IllegalStateException("Este cambio de estado no está permitido manualmente");
        }
        solicitud.setEstado(nuevoEstado);
        solicitudRepository.save(solicitud);
    }
}
