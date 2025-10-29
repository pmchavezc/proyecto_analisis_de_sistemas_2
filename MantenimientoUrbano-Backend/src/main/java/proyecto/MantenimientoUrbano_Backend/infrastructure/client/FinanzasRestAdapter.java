package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.SolicitudFinancieraDTO;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class FinanzasRestAdapter implements PortalFinanzas {

    private final RestTemplate restTemplate;

    @Value("${finanzas.usuario}")
    private String usuario;

    @Value("${finanzas.password}")
    private String password;

    @Value("${finanzas.login-url}")
    private String loginUrl;

    @Value("${finanzas.api-base}")
    private String apiBase;

    private String obtenerToken() {
        Map<String, String> body = Map.of(
                "email", usuario,
                "password", password
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(loginUrl, entity, Map.class);

        if (response.getBody() == null || !response.getBody().containsKey("token")) {
            throw new IllegalStateException("No se pudo obtener el token de Finanzas");
        }

        return response.getBody().get("token").toString();
    }

    @Override
    public SolicitudFinanciamientoResponse solicitarFinanciamiento(SolicitudFinanciamientoRequest request) {
        String token = obtenerToken();

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
                apiBase + "/Request",
                entity,
                FinanzasResponseRaw.class
        );

        if (response.getBody() == null || response.getBody().getData() == null) {
            throw new IllegalStateException("Respuesta inválida del sistema de Finanzas");
        }

        var raw = response.getBody().getData();
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
        String token = obtenerToken();
        String url = apiBase + "/Request/" + idFinanciamiento;

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

    public List<SolicitudFinancieraDTO> obtenerSolicitudes() {
        String token = obtenerToken();
        String url = apiBase + "/Request?Include=requestStatus,origin,priority&PageNumber=1&PageSize=30&IncludeTotal=false";

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Map.class
        );

        List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");

        return data.stream()
                .map(item -> SolicitudFinancieraDTO.builder()
                        .id(Long.valueOf(item.get("id").toString()))
                        .name(item.get("name").toString())
                        .reason(item.get("reason").toString())
                        .requestAmount(Double.valueOf(item.get("requestAmount").toString()))
                        .approvedDate(item.get("approvedDate") != null ? item.get("approvedDate").toString() : null)
                        .email(item.get("email").toString())
                        .requestStatusId((Integer) item.get("requestStatusId"))
                        .requestStatusNombre(item.get("requestStatus") != null ? ((Map<?, ?>) item.get("requestStatus")).get("name").toString() : null)
                        .priorityNombre(item.get("priority") != null ? ((Map<?, ?>) item.get("priority")).get("name").toString() : null)
                        .originNombre(item.get("origin") != null ? ((Map<?, ?>) item.get("origin")).get("name").toString() : null)
                        .build())
                .toList();
    }
}
