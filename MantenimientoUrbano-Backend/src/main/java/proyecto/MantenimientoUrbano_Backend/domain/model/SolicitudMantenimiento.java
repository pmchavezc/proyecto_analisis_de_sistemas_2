package proyecto.MantenimientoUrbano_Backend.domain.model;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudMantenimiento {
    private Long id;
    private String tipo;
    private String descripcion;
    private String ubicacion;
    private Prioridad prioridad;
    private EstadoSolicitud estado;
    private LocalDate fechaRegistro;
    private String fuente;
    private Long reporteIdExtern;
    private EstadoFinanciamiento estadoFinanciero;

    private LocalDate fechaProgramada;
    private String cuadrillaAsignada;
    private List<String> recursosAsignados;
}