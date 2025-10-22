package proyecto.MantenimientoUrbano_Backend.infrastructure.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.MantenimientoUrbano_Backend.application.usecase.SolicitarFinanciamientoUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoRequest;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudFinanciamientoResponse;

@RestController
@RequestMapping("/api/mantenimiento/solicitudes")
@RequiredArgsConstructor
public class FinanciamientoController {

    private final SolicitarFinanciamientoUseCase useCase;

    @PostMapping("/{id}/financiamiento")
    public ResponseEntity<SolicitudFinanciamientoResponse> solicitarFinanciamiento(
            @PathVariable Long id,
            @RequestBody SolicitudFinanciamientoRequest request
    ) {
        // Usamos el ID de la URL como el ID de la solicitud interna
        // Pero dejamos el originId del JSON tal como viene (ej. 1 para Mantenimiento Urbano)
        SolicitudFinanciamientoResponse response = useCase.solicitarFinanciamiento(request, id);
        return ResponseEntity.ok(response);
    }

}
