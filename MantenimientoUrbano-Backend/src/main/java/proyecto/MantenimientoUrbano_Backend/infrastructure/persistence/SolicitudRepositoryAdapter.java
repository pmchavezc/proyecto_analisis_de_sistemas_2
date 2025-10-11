package proyecto.MantenimientoUrbano_Backend.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SolicitudRepositoryAdapter implements SolicitudRepository {

    private final SolicitudJpaRepository jpaRepository;


    @Override
    public SolicitudMantenimiento save(SolicitudMantenimiento solicitud) {
        SolicitudMantenimientoEntity entity = SolicitudMantenimientoEntity.builder()
                .tipo(solicitud.getTipo())
                .descripcion(solicitud.getDescripcion())
                .ubicacion(solicitud.getUbicacion())
                .prioridad(solicitud.getPrioridad())
                .estado(solicitud.getEstado())
                .fechaRegistro(solicitud.getFechaRegistro())
                .fuente(solicitud.getFuente())
                .reporteIdExtern(solicitud.getReporteIdExtern())
                .build();

        SolicitudMantenimientoEntity saved = jpaRepository.save(entity);

        solicitud.setId(saved.getId());
        return solicitud;
    }

    @Override
    public Optional<SolicitudMantenimiento> findById(Long id) {
        return jpaRepository.findById(id).map(entity -> SolicitudMantenimiento.builder()
                .id(entity.getId())
                .tipo(entity.getTipo())
                .descripcion(entity.getDescripcion())
                .ubicacion(entity.getUbicacion())
                .prioridad(entity.getPrioridad())
                .estado(entity.getEstado())
                .fechaRegistro(entity.getFechaRegistro())
                .fuente(entity.getFuente())
                .reporteIdExtern(entity.getReporteIdExtern())
                .build());
    }

    @Override
    public List<SolicitudMantenimiento> findPendientesOrdenadas() {
        return jpaRepository.findAll().stream()
                .filter(e -> e.getEstado() == EstadoSolicitud.PENDIENTE)
                .sorted((a, b) -> {
                    int cmp = b.getPrioridad().compareTo(a.getPrioridad());
                    return cmp != 0 ? cmp : a.getFechaRegistro().compareTo(b.getFechaRegistro());
                })
                .map(entity -> SolicitudMantenimiento.builder()
                        .id(entity.getId())
                        .tipo(entity.getTipo())
                        .descripcion(entity.getDescripcion())
                        .ubicacion(entity.getUbicacion())
                        .prioridad(entity.getPrioridad())
                        .estado(entity.getEstado())
                        .fechaRegistro(entity.getFechaRegistro())
                        .fuente(entity.getFuente())
                        .reporteIdExtern(entity.getReporteIdExtern())
                        .build())
                .toList();
    }
}