package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import proyecto.MantenimientoUrbano_Backend.application.dto.RequestFinanciamientoDTO;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoRequest;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoResponse;
import proyecto.MantenimientoUrbano_Backend.domain.port.PortalFinanzas;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.FinanzasEstadoResponse;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.FinanzasResponseRaw;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class FinanzasRestAdapter implements PortalFinanzas {

    private final RestTemplate restTemplate;

    @Override
    public SolicitudFinanciamientoResponse solicitarFinanciamiento(SolicitudFinanciamientoRequest request) {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyIiwiZW1haWwiOiJtYW50ZW5pbWllbnRvQGdtYWlsLmNvbSIsInVuaXF1ZV9uYW1lIjoiTWFudGVuaW1pZW50byIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2hhc2giOiIzZTRiNDVhMy1hNTJjLTQ0NzEtYTU3MC1jYzRkMzJhMWY2YTUiLCJPcGVyYXRvciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRob3JpemF0aW9uZGVjaXNpb24iOlsiMSIsIjIiLCI1Il0sIm5iZiI6MTc2MTE4NzczNywiZXhwIjoxNzYxMjAyNDM3LCJpYXQiOjE3NjExODgwMzd9.JyV78h0WvCPKO2cEDzAYwAfsmWoF5gsef0gfmcFX7vI";

        RequestFinanciamientoDTO dto = RequestFinanciamientoDTO.builder()
                .originId(request.getOriginId())
                .requestAmount(request.getRequestAmount())
                .name(request.getName())
                .reason(request.getReason())
                .requestDate(request.getRequestDate())
                .email(request.getEmail())
                .priorityId(request.getPriorityId())
                .build();

        try {
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(dto);
            System.out.println("JSON enviado a Finanzas: " + json);
        } catch (Exception e) {
            System.err.println("Error al serializar DTO: " + e.getMessage());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<RequestFinanciamientoDTO> entity = new HttpEntity<>(dto, headers);

        ResponseEntity<FinanzasResponseRaw> response = restTemplate.postForEntity(
                "http://93.127.139.74:83/api/v1/Request",
                entity,
                FinanzasResponseRaw.class
        );

        if (response.getBody() == null || response.getBody().getData() == null) {
            throw new IllegalStateException("Respuesta inválida del sistema de Finanzas");
        }

        var raw = response.getBody().getData();

        // ✅ Formato esperado por Finanzas: dd/MM/yyyy
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return SolicitudFinanciamientoResponse.builder()
                .idTransaccion(String.valueOf(raw.getId()))
                .estado(raw.getRequestStatusId() == 2
                        ? EstadoFinanciamiento.APROBADO
                        : EstadoFinanciamiento.EN_ESPERA_FINANCIAMIENTO)
                .montoAutorizado(request.getRequestAmount())
                .motivo(raw.getAuthorizedReason() != null
                        ? raw.getAuthorizedReason()
                        : raw.getRejectionReason())
                .fechaSolicitud(raw.getRequestDate() != null
                        ? LocalDate.parse(raw.getRequestDate(), formatter)
                        : null)
                .fechaDecision(raw.getApprovedDate() != null
                        ? LocalDate.parse(raw.getApprovedDate(), formatter)
                        : null)
                .build();
    }

    @Override
    public EstadoFinanciamiento consultarEstadoFinanciero(Long idFinanciamiento) {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyIiwiZW1haWwiOiJtYW50ZW5pbWllbnRvQGdtYWlsLmNvbSIsInVuaXF1ZV9uYW1lIjoiTWFudGVuaW1pZW50byIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2hhc2giOiIzZTRiNDVhMy1hNTJjLTQ0NzEtYTU3MC1jYzRkMzJhMWY2YTUiLCJPcGVyYXRvciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRob3JpemF0aW9uZGVjaXNpb24iOlsiMSIsIjIiLCI1Il0sIm5iZiI6MTc2MTE4NzczNywiZXhwIjoxNzYxMjAyNDM3LCJpYXQiOjE3NjExODgwMzd9.JyV78h0WvCPKO2cEDzAYwAfsmWoF5gsef0gfmcFX7vI";

        String url = "http://93.127.139.74:83/api/v1/Request/" + idFinanciamiento;

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<FinanzasEstadoResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                FinanzasEstadoResponse.class
        );

        if (response.getBody() == null || response.getBody().getData() == null) {
            throw new IllegalStateException("No se pudo obtener el estado desde Finanzas");
        }

        int statusId = response.getBody().getData().getRequestStatusId();

        return switch (statusId) {
            case 1 -> EstadoFinanciamiento.EN_ESPERA_FINANCIAMIENTO;
            case 2 -> EstadoFinanciamiento.FINANCIADA;
            case 3 -> EstadoFinanciamiento.RECHAZADO;
            default -> throw new IllegalStateException("Estado desconocido: " + statusId);
        };
    }
}
