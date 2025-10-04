package proyecto.MantenimientoUrbano_Backend.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrarSolicitudRequest {
    @NotBlank
    private String tipo;

    @NotBlank
    private String descripcion;

    @NotBlank
    private String ubicacion;

    @NotNull
    private String prioridad;

    @NotBlank
    private String fuente;

    @NotNull
    private Long reporteIdExtern;
}