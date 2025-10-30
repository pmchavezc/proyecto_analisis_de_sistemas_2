package proyecto.MantenimientoUrbano_Backend.infrastructure.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping(value = {"/{path:[^\\.]*}", "/"})
    public String redirect() {
        return "forward:/index.html";
    }
}