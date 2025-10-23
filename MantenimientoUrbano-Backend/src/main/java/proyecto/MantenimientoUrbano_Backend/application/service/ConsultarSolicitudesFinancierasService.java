package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.FinanzasRestAdapter;
import proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto.SolicitudFinancieraDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultarSolicitudesFinancierasService {

    private final FinanzasRestAdapter adapter;

    public List<SolicitudFinancieraDTO> listarSolicitudes() {
        return adapter.obtenerSolicitudes();
    }
}
