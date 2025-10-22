package proyecto.MantenimientoUrbano_Backend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class RequestFinanciamientoDTO {
    private Long originId;
    private BigDecimal requestAmount;
    private String name;
    private String reason;
    private String requestDate;
    private String email;
    private Integer priorityId;
}
