package proyecto.MantenimientoUrbano_Backend.infrastructure.client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.MantenimientoUrbano_Backend.domain.model.ConfirmacionFinanzasEvent;
import proyecto.MantenimientoUrbano_Backend.domain.port.ManejadorEventosFinanzas;

@RestController
@RequestMapping("/api/finanzas/eventos")
@RequiredArgsConstructor
public class FinanzasEventAdapter {

    private final ManejadorEventosFinanzas manejador;

    @PostMapping("/confirmacion")
    public ResponseEntity<Void> recibirConfirmacion(@RequestBody ConfirmacionFinanzasEvent event){
        manejador.conConfirmacionFinanciamiento(event);
        return ResponseEntity.ok().build();
    }
}
