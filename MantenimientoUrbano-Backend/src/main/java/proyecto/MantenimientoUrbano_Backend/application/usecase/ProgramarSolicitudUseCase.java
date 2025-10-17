package proyecto.MantenimientoUrbano_Backend.application.usecase;

import proyecto.MantenimientoUrbano_Backend.application.dto.ProgramacionRequest;

public interface ProgramarSolicitudUseCase {
    void programar(Long idSolicitud, ProgramacionRequest request);
}
