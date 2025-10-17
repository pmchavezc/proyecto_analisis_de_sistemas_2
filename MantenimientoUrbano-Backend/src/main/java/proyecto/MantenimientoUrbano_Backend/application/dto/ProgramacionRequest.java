package proyecto.MantenimientoUrbano_Backend.application.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramacionRequest {
    private LocalDate fechaInicio;
    private String cuadrilla;
    private List<String> recursos;
}