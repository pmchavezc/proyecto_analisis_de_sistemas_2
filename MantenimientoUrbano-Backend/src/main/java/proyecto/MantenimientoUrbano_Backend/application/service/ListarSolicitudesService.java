package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.application.usecase.ListarSolicitudesUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarSolicitudesService implements ListarSolicitudesUseCase {

    private final SolicitudRepository repository;

    @Override
    public List<SolicitudMantenimiento> listarPendientesOrdenadas() {
        return repository.findPendientesOrdenadas();
    }

    @Override
    public List<SolicitudMantenimiento> listarTodasOrdenadas() {
        return repository.findTodasOrdenadas();
    }
}