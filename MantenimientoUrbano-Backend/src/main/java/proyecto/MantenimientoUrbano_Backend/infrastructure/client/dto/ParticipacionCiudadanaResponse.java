package proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto;

import lombok.Data;

import java.util.List;

@Data
public class ParticipacionCiudadanaResponse {
    private List<ReporteRaw> items;
    private int total;
    private int totalPages;
    private int index;
}