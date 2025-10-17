package proyecto.MantenimientoUrbano_Backend.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.Prioridad;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "solicitudes_mantenimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudMantenimientoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private String descripcion;
    private String ubicacion;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estado;

    private LocalDate fechaRegistro;

    private String fuente;
    private Long reporteIdExtern;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_financiero")
    private EstadoFinanciamiento estadoFinanciero;

    private LocalDate fechaProgramada;

    private String cuadrillaAsignada;

    @ElementCollection
    @CollectionTable(name = "recursos_asignados", joinColumns = @JoinColumn(name = "solicitud_id"))
    @Column(name = "recurso")
    private List<String> recursosAsignados;
}
