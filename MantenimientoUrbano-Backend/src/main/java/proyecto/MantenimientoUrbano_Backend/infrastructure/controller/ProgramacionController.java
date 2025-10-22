package proyecto.MantenimientoUrbano_Backend.infrastructure.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.MantenimientoUrbano_Backend.application.dto.ProgramacionRequest;
import proyecto.MantenimientoUrbano_Backend.application.exception.SolicitudProgramadaException;
import proyecto.MantenimientoUrbano_Backend.application.usecase.ProgramarSolicitudUseCase;

@RestController
@RequestMapping("/api/mantenimiento/solicitudes")
@RequiredArgsConstructor
public class ProgramacionController {

    private final ProgramarSolicitudUseCase useCase;

    @PostMapping("/{id}/programar")
    public ResponseEntity<Void> programarSolicitud(
            @PathVariable Long id,
            @RequestBody ProgramacionRequest request) {
        useCase.programar(id, request);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(SolicitudProgramadaException.class)
    public ResponseEntity<String> handleSolicitudYaProgramada(SolicitudProgramadaException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

}