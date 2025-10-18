package proyecto.MantenimientoUrbano_Backend.application.usecase;

import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;

import java.util.List;

public interface ListarSolicitudesUseCase {
    List<SolicitudMantenimiento> listarPendientesOrdenadas();
    List<SolicitudMantenimiento> listarTodasOrdenadas();
}