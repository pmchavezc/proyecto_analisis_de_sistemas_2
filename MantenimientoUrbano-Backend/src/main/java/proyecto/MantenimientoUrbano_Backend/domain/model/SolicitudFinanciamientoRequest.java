package proyecto.MantenimientoUrbano_Backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudFinanciamientoRequest {
    private Long idSolicitud;
    private String tipoGasto;
    private BigDecimal montoEstimado;
    private List<ArchivoAdjuntoDTO> adjuntos;
}