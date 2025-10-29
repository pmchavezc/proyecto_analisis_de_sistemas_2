package proyecto.MantenimientoUrbano_Backend.infrastructure.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/{path:^(?!api|static|swagger-ui).*}/**")
    public String redirect() {
        return "forward:/index.html";
    }
}
