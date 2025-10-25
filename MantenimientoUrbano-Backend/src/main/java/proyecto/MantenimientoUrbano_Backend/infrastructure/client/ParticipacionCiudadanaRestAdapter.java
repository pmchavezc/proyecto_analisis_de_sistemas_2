package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.ParticipacionCiudadanaResponse;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.ReporteCiudadanoDTO;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ParticipacionCiudadanaRestAdapter {

    private final RestTemplate restTemplate;
    private final SolicitudRepository solicitudRepository;

    // Token JWT para autenticación con el sistema externo
    private static final String BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvbGlzOTI1NjlAaGg3Zi5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJNYW50ZW5pbWllbnRvIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI5NDE4MjYzNS04MzMxLTQ4ZWUtODVmZS0zODdhMDc1YjhhOGQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZ2VzdGlvbm1hbnRlIiwiZXhwIjoxNzYxNDk3NTMwfQ.TLjm7JfLKtxVqe1Nai3XgFXK12TjE8RoUtC0Wpiqn1M";

    public List<ReporteCiudadanoDTO> obtenerReportesAprobados() {
        String url = "http://93.127.139.74:84/reports?all=true";

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(BEARER_TOKEN);

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

        List<Long> reportesYaUsados = solicitudRepository.findTodasOrdenadas().stream()
                .map(SolicitudMantenimiento::getReporteIdExtern)
                .filter(Objects::nonNull)
                .toList();

        return response.getBody().getItems().stream()
                .filter(r -> r.getStatus() != null && r.getStatus().getId() == 3) // Solo aprobados
                .filter(r -> !reportesYaUsados.contains(r.getId())) // Solo los no usados
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
