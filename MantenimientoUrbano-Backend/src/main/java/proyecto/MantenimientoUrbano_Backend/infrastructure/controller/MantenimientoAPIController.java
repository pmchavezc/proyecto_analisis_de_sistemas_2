package proyecto.MantenimientoUrbano_Backend.infrastructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyecto.MantenimientoUrbano_Backend.application.dto.RegistrarSolicitudRequest;
import proyecto.MantenimientoUrbano_Backend.application.usecase.ListarSolicitudesUseCase;
import proyecto.MantenimientoUrbano_Backend.application.usecase.RegistrarSolicitudUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimiento")
@RequiredArgsConstructor
public class MantenimientoAPIController {

    private final RegistrarSolicitudUseCase registrarSolicitudUseCase;
    private final ListarSolicitudesUseCase listarSolicitudesUseCase;

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

}