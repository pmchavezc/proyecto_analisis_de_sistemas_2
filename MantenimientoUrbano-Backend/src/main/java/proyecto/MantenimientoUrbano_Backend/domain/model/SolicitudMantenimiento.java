package proyecto.MantenimientoUrbano_Backend.domain.model;

import lombok.*;

import java.time.LocalDate;

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

    public void marcarComoProgramada() {
        this.estado = EstadoSolicitud.PROGRAMADA;
    }

    public void cancelar(String motivo) {
        this.estado = EstadoSolicitud.CANCELADA;
    }
}