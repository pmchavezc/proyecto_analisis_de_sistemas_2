package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.ParticipacionCiudadanaRestAdapter;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.ReporteCiudadanoDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultarReportesCiudadanosService {

    private final ParticipacionCiudadanaRestAdapter adapter;

    public List<ReporteCiudadanoDTO> listarReportesAprobados() {
        return adapter.obtenerReportesAprobados();
    }
}