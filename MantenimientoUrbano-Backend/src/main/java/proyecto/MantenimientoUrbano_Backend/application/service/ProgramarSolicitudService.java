    package proyecto.MantenimientoUrbano_Backend.application.service;

    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;
    import proyecto.MantenimientoUrbano_Backend.application.dto.ProgramacionRequest;
    import proyecto.MantenimientoUrbano_Backend.application.exception.SolicitudProgramadaException;
    import proyecto.MantenimientoUrbano_Backend.application.usecase.ProgramarSolicitudUseCase;
    import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
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

            // ✅ Validación financiera: solo se puede programar si está financiada
            if (!solicitud.getEstadoFinanciero().equals(EstadoFinanciamiento.FINANCIADA)) {
                throw new IllegalStateException("Solo se puede programar una solicitud que ya fue financiada");
            }

            if (!solicitud.getEstado().equals(EstadoSolicitud.PENDIENTE)) {
                throw new SolicitudProgramadaException("Ya se programo esta solicitud porque ya cuenta con los fondos, consulte con el administrador");
            }
            // ✅ RN4: fecha no puede ser anterior a hoy
            if (request.getFechaInicio().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("La fecha de inicio no puede ser anterior a hoy (RN4)");
            }

            // ✅ RN5: debe asignarse una cuadrilla
            if (request.getCuadrilla() == null || request.getCuadrilla().isBlank()) {
                throw new IllegalArgumentException("Debe asignarse al menos una cuadrilla (RN5)");
            }

            // ✅ Actualización de estado y datos operativos
            solicitud.setEstado(EstadoSolicitud.PROGRAMADA);
            solicitud.setFechaProgramada(request.getFechaInicio());
            solicitud.setCuadrillaAsignada(request.getCuadrilla());
            solicitud.setRecursosAsignados(request.getRecursos());

            solicitudRepository.save(solicitud);
        }

    }
