package proyecto.MantenimientoUrbano_Backend.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.application.dto.RegistrarSolicitudRequest;
import proyecto.MantenimientoUrbano_Backend.application.usecase.RegistrarSolicitudUseCase;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.Prioridad;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class RegistrarSolicitudService implements RegistrarSolicitudUseCase {

    private final SolicitudRepository repository;

    @Override
    public SolicitudMantenimiento registrar(RegistrarSolicitudRequest request) {
        Prioridad prioridad = Prioridad.valueOf(request.getPrioridad().toUpperCase());

        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .tipo(request.getTipo())
                .descripcion(request.getDescripcion())
                .ubicacion(request.getUbicacion())
                .prioridad(prioridad)
                .estado(EstadoSolicitud.PENDIENTE)
                .estadoFinanciero(EstadoFinanciamiento.PENDIENTE)
                .fechaRegistro(java.time.LocalDate.now())
                .fuente(request.getFuente())
                .reporteIdExtern(request.getReporteIdExtern())
                .build();

        return repository.save(solicitud);
    }
}