package proyecto.MantenimientoUrbano_Backend.application.usecase;

import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;

public interface NotificarCambioEstadoUseCase {
    void notificarSiAplica(SolicitudMantenimiento solicitud);
}
