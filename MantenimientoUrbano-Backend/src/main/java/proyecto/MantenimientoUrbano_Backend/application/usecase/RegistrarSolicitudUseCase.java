package proyecto.MantenimientoUrbano_Backend.application.usecase;

import proyecto.MantenimientoUrbano_Backend.application.dto.RegistrarSolicitudRequest;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;

public interface RegistrarSolicitudUseCase {
    SolicitudMantenimiento registrar(RegistrarSolicitudRequest request);
}