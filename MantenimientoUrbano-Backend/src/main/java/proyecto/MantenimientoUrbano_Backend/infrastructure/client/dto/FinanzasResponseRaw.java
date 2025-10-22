package proyecto.MantenimientoUrbano_Backend.infrastructure.client.dto;

import lombok.Data;

@Data
public class FinanzasResponseRaw {
    private boolean success;
    private String message;
    private FinanzasData data;
}
