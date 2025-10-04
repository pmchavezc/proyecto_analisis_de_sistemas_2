package proyecto.MantenimientoUrbano_Backend.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudJpaRepository extends JpaRepository<SolicitudMantenimientoEntity, Long> {
}