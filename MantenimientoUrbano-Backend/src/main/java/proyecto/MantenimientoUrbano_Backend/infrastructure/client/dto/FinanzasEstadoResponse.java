package proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto;

import lombok.Data;

@Data
public class FinanzasEstadoResponse {
    private boolean success;
    private String message;
    private FinanzasEstadoData data;
}
