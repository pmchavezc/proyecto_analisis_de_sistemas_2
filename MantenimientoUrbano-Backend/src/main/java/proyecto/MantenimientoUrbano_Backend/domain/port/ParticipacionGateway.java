package proyecto.MantenimientoUrbano_Backend.domain.port;

import proyecto.MantenimientoUrbano_Backend.application.dto.NotificacionEstadoDTO;

public interface ParticipacionGateway {
    void enviarNotificacion(NotificacionEstadoDTO notificacion);
}