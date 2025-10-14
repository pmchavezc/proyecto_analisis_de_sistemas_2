package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoRequest;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoResponse;
import proyecto.MantenimientoUrbano_Backend.domain.port.PortalFinanzas;

@Component
@RequiredArgsConstructor
public class FinanzasRestAdapter implements PortalFinanzas {

    private final RestTemplate restTemplate;

    @Override
    public SolicitudFinanciamientoResponse solicitarFinanciamiento(SolicitudFinanciamientoRequest request) {
        return restTemplate.postForObject("http://finanzas-api/financiamiento", request, SolicitudFinanciamientoResponse.class);
    }
}