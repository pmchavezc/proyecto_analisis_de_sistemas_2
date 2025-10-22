package proyecto.MantenimientoUrbano_Backend.infrastructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.MantenimientoUrbano_Backend.application.dto.RegistrarSolicitudRequest;
import proyecto.MantenimientoUrbano_Backend.application.usecase.CambiarEstadoSolicitudUseCase;
import proyecto.MantenimientoUrbano_Backend.application.usecase.ListarSolicitudesUseCase;
import proyecto.MantenimientoUrbano_Backend.application.usecase.RegistrarSolicitudUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimiento")
@RequiredArgsConstructor
public class MantenimientoController {

    private final RegistrarSolicitudUseCase registrarSolicitudUseCase;
    private final ListarSolicitudesUseCase listarSolicitudesUseCase;
    private final CambiarEstadoSolicitudUseCase cambiarEstadoSolicitudUseCase;

    @PostMapping("/solicitudes")
    public ResponseEntity<SolicitudMantenimiento> registrarSolicitud(
            @Valid @RequestBody RegistrarSolicitudRequest request) {
        SolicitudMantenimiento resultado = registrarSolicitudUseCase.registrar(request);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/solicitudes/pendientes")
    public ResponseEntity<List<SolicitudMantenimiento>> listarPendientes() {
        return ResponseEntity.ok(listarSolicitudesUseCase.listarPendientesOrdenadas());
    }

    @GetMapping("/solicitudes/todas")
    public ResponseEntity<List<SolicitudMantenimiento>> listarTodas() {
        return ResponseEntity.ok(listarSolicitudesUseCase.listarTodasOrdenadas());
    }
    @PutMapping("/solicitudes/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoSolicitud estado
    ) {
        cambiarEstadoSolicitudUseCase.cambiarEstado(id, estado);
        return ResponseEntity.ok().build();
    }

}