package proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudFinancieraDTO {
    private Long id;
    private String name;
    private String reason;
    private Double requestAmount;
    private String approvedDate;
    private String email;
    private Integer requestStatusId;
    private String requestStatusNombre;
    private String priorityNombre;
    private String originNombre;

}