package proyecto.MantenimientoUrbano_Backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmacionFinanzasEvent {
    private String idTransaccion;
    private Long idSolicitud;
    private EstadoFinanciamiento estado;
    private BigDecimal montoAutorizado;
    private String motivo;
    private LocalDate fechaDecision;
}