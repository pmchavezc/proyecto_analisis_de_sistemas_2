package proyecto.MantenimientoUrbano_Backend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionEstadoDTO {
    private Long idSolicitud;
    private EstadoSolicitud estado;
    private LocalDate fechaModificacion;
}
