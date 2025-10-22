package proyecto.MantenimientoUrbano_Backend.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.client.ClientHttpRequestInterceptor;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .additionalMessageConverters(new MappingJackson2HttpMessageConverter())
                .interceptors(logRequestInterceptor())
                .build();
    }

    private List<ClientHttpRequestInterceptor> logRequestInterceptor() {
        return List.of((request, body, execution) -> {
            System.out.println("➡️ Enviando a Finanzas:");
            System.out.println("URL: " + request.getURI());
            System.out.println("Método: " + request.getMethod());
            System.out.println("Headers: " + request.getHeaders());
            System.out.println("Body: " + new String(body, StandardCharsets.UTF_8));
            return execution.execute(request, body);
        });
    }
}