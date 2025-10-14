package proyecto.MantenimientoUrbano_Backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArchivoAdjuntoDTO {
    private String nombreArchivo;
    private String tipoMime;
    private byte[] contenido;
}