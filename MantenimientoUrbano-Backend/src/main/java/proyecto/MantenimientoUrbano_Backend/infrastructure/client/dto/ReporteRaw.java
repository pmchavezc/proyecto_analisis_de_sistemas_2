package proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto;

import lombok.Data;

@Data
public class ReporteRaw {
    private Long id;
    private String title;
    private String description;
    private String location;
    private ReporteStatus status;
    private ReporteTipo type;
    private ReporteUsuario userCreate;
}
