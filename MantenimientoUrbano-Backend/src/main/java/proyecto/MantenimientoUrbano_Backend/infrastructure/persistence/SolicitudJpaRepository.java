package proyecto.MantenimientoUrbano_Backend.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;

public interface SolicitudJpaRepository extends JpaRepository<SolicitudMantenimientoEntity, Long> {

    @Modifying
    @Query("UPDATE SolicitudMantenimientoEntity s SET s.estadoFinanciero = :estado, s.idFinanciamiento = :idFinanciamiento WHERE s.id = :idSolicitud")
    void actualizarEstadoFinanciero(@Param("idSolicitud") Long idSolicitud,
                                    @Param("estado") EstadoFinanciamiento estado,
                                    @Param("idFinanciamiento") Long idFinanciamiento);
}