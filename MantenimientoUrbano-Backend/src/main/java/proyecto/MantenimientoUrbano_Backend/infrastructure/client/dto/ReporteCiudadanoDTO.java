package proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReporteCiudadanoDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String tipo;
    private String estado;
    private String creadoPor;
}
