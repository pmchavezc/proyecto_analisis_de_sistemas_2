package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.ParticipacionCiudadanaResponse;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.ReporteCiudadanoDTO;

import java.util.List;
import java.util.stream.Collectors;
@Component
@RequiredArgsConstructor
public class ParticipacionCiudadanaRestAdapter {

    private final RestTemplate restTemplate;

    public List<ReporteCiudadanoDTO> obtenerReportesAprobados() {
        String url = "http://93.127.139.74:84/reports?all=true";

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<ParticipacionCiudadanaResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                ParticipacionCiudadanaResponse.class
        );

        if (response.getBody() == null || response.getBody().getItems() == null) {
            throw new IllegalStateException("No se pudo obtener reportes desde Participación Ciudadana");
        }

        return response.getBody().getItems().stream()
                .filter(r -> r.getStatus() != null && r.getStatus().getId() == 3) // Solo aprobados
                .map(r -> ReporteCiudadanoDTO.builder()
                        .id(r.getId())
                        .title(r.getTitle())
                        .description(r.getDescription())
                        .location(r.getLocation())
                        .tipo(r.getType() != null ? r.getType().getName() : "Desconocido")
                        .estado(r.getStatus().getName())
                        .creadoPor(r.getUserCreate() != null ? r.getUserCreate().getName() : "Anónimo")
                        .build())
                .collect(Collectors.toList());
    }
}