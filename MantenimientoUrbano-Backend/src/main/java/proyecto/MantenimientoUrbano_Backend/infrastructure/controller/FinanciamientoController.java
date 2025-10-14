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
        request.setIdSolicitud(id);
        var response = useCase.solicitarFinanciamiento(request);
        return ResponseEntity.ok(response);
    }
}