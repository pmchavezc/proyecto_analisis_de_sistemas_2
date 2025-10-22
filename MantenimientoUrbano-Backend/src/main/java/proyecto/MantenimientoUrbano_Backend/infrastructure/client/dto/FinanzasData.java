package proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto;

import lombok.Data;

@Data
public class FinanzasData {
    private Long id;
    private Integer requestStatusId;
    private String approvedDate;
    private String rejectionReason;
    private String authorizedReason;
    private String requestDate;
}
