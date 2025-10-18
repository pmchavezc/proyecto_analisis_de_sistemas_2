package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import proyecto.MantenimientoUrbano_Backend.application.dto.NotificacionEstadoDTO;
import proyecto.MantenimientoUrbano_Backend.domain.port.ParticipacionGateway;


@Component
@RequiredArgsConstructor
public class ParticipacionRestAdapter implements ParticipacionGateway {
    private final RestTemplate restTemplate;

    @Override
    public void enviarNotificacion(NotificacionEstadoDTO notificacion) {
        String url = "https://participacion-ciudadana.api/notificaciones";
        restTemplate.postForEntity(url, notificacion, Void.class);
    }
}
