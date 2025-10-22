package proyecto.MantenimientoUrbano_Backend.infrastructure.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import proyecto.MantenimientoUrbano_Backend.application.service.ConsultarReportesCiudadanosService;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.ReporteCiudadanoDTO;

import java.util.List;

@RestController
@RequestMapping("/api/participacion")
@RequiredArgsConstructor
public class CiudadaniaController {

    private final ConsultarReportesCiudadanosService service;

    @GetMapping("/reportes-aprobados")
    public ResponseEntity<List<ReporteCiudadanoDTO>> listarReportesAprobados() {
        List<ReporteCiudadanoDTO> reportes = service.listarReportesAprobados();
        return ResponseEntity.ok(reportes);
    }

}
