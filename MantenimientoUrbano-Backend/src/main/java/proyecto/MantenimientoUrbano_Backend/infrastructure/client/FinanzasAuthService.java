package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;


@Service
public class FinanzasAuthService {

    private final RestTemplate restTemplate;

    public FinanzasAuthService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public String obtenerToken() {
        String url = "http://93.127.139.74:83/api/v1/auth";

        Map<String, String> body = Map.of(
                "userName", "mantenimiento@gmail.com",
                "password", "Guatemala1."
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        Map data = (Map) response.getBody().get("data");
        return (String) data.get("token");
    }
}
