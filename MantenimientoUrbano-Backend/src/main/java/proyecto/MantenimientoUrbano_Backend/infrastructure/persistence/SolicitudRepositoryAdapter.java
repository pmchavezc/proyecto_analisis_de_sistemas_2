package proyecto.MantenimientoUrbano_Backend.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SolicitudRepositoryAdapter implements SolicitudRepository {

    private final SolicitudJpaRepository jpaRepository;

    @Override
    public SolicitudMantenimiento save(SolicitudMantenimiento solicitud) {
        SolicitudMantenimientoEntity entity;

        if (solicitud.getId() != null) {
            // Actualización: buscá la entidad existente
            entity = jpaRepository.findById(solicitud.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

            // Actualizá solo los campos necesarios
            entity.setEstado(solicitud.getEstado());
            entity.setEstadoFinanciero(solicitud.getEstadoFinanciero());
            entity.setFechaProgramada(solicitud.getFechaProgramada());
            entity.setCuadrillaAsignada(solicitud.getCuadrillaAsignada());
            entity.setIdFinanciamiento(solicitud.getIdFinanciamiento());
            entity.setRecursosAsignados(
                    solicitud.getRecursosAsignados() != null
                            ? new ArrayList<>(solicitud.getRecursosAsignados())
                            : new ArrayList<>()
            );
            // Podés agregar más campos si querés que se actualicen
        } else {
            // Registro nuevo
            entity = SolicitudMantenimientoEntity.builder()
                    .tipo(solicitud.getTipo())
                    .descripcion(solicitud.getDescripcion())
                    .ubicacion(solicitud.getUbicacion())
                    .prioridad(solicitud.getPrioridad())
                    .estado(solicitud.getEstado())
                    .fechaRegistro(solicitud.getFechaRegistro())
                    .fuente(solicitud.getFuente())
                    .reporteIdExtern(solicitud.getReporteIdExtern())
                    .estadoFinanciero(solicitud.getEstadoFinanciero())
                    .fechaProgramada(solicitud.getFechaProgramada())
                    .cuadrillaAsignada(solicitud.getCuadrillaAsignada())
                    .idFinanciamiento(solicitud.getIdFinanciamiento())
                    .recursosAsignados(
                            solicitud.getRecursosAsignados() != null
                                    ? new ArrayList<>(solicitud.getRecursosAsignados())
                                    : new ArrayList<>()
                    )
                    .build();
        }

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
                .estadoFinanciero(entity.getEstadoFinanciero())
                .estadoFinanciero(entity.getEstadoFinanciero())
                .fechaProgramada(entity.getFechaProgramada())
                .cuadrillaAsignada(entity.getCuadrillaAsignada())
                .idFinanciamiento(entity.getIdFinanciamiento())
                .recursosAsignados(entity.getRecursosAsignados())
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
                        .estadoFinanciero(entity.getEstadoFinanciero())
                        .estadoFinanciero(entity.getEstadoFinanciero())
                        .fechaProgramada(entity.getFechaProgramada())
                        .cuadrillaAsignada(entity.getCuadrillaAsignada())
                        .idFinanciamiento(entity.getIdFinanciamiento())
                        .recursosAsignados(entity.getRecursosAsignados())
                        .build())
                .toList();
    }

    @Override
    public List<SolicitudMantenimiento> findTodasOrdenadas() {
        return jpaRepository.findAll().stream()
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
                        .estadoFinanciero(entity.getEstadoFinanciero())
                        .fechaProgramada(entity.getFechaProgramada())
                        .cuadrillaAsignada(entity.getCuadrillaAsignada())
                        .idFinanciamiento(entity.getIdFinanciamiento())
                        .recursosAsignados(entity.getRecursosAsignados())
                        .build())
                .toList();
    }

    @Transactional
    @Override
    public void actualizarEstadoFinanciero(Long idSolicitud, EstadoFinanciamiento estado, Long idFinanciamiento) {
        jpaRepository.actualizarEstadoFinanciero(idSolicitud, estado, idFinanciamiento);
    }

}
