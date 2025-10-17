package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.application.dto.ProgramacionRequest;
import proyecto.MantenimientoUrbano_Backend.application.usecase.ProgramarSolicitudUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ProgramarSolicitudService implements ProgramarSolicitudUseCase {

    private final SolicitudRepository solicitudRepository;

    @Override
    public void programar(Long idSolicitud, ProgramacionRequest request) {
        SolicitudMantenimiento solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        if (!solicitud.getEstado().equals(EstadoSolicitud.PENDIENTE)) {
            throw new IllegalStateException("Solo se puede programar una solicitud pendiente");
        }

        if (request.getFechaInicio().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser anterior a hoy (RN4)");
        }

        if (request.getCuadrilla() == null || request.getCuadrilla().isBlank()) {
            throw new IllegalArgumentException("Debe asignarse al menos una cuadrilla (RN5)");
        }

        solicitud.setEstado(EstadoSolicitud.PROGRAMADA);
        solicitud.setFechaProgramada(request.getFechaInicio());
        solicitud.setCuadrillaAsignada(request.getCuadrilla());
        solicitud.setRecursosAsignados(request.getRecursos());

        solicitudRepository.save(solicitud);
    }
}
