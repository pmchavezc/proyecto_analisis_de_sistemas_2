package proyecto.MantenimientoUrbano_Backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Gestión Mantenimiento Urbano")
                        .version("1.0")
                        .description("Documentación de la API REST para el sistema de mantenimiento urbano"));
    }
}