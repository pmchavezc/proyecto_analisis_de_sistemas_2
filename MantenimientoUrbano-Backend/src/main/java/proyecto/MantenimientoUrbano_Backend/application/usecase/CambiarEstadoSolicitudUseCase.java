package proyecto.MantenimientoUrbano_Backend.application.usecase;

import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;

public interface CambiarEstadoSolicitudUseCase {
    void cambiarEstado(Long idSolicitud, EstadoSolicitud nuevoEstado);
}
