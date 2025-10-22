package proyecto.MantenimientoUrbano_Backend.application.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import proyecto.MantenimientoUrbano_Backend.application.dto.RequestFinanciamientoDTO;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
public class RequestFinanciamientoDTOTest {

    @Test
    void testJsonGeneradoEsCorrecto() throws Exception {
        RequestFinanciamientoDTO dto = RequestFinanciamientoDTO.builder()
                .originId(1L)
                .requestAmount(BigDecimal.TEN)
                .name("Mantenimiento Urbano")
                .reason("Baches en Vista Hermosa")
                .requestDate("2025-10-12")
                .email("joelmorales05982@gmail.com")
                .priorityId(3)
                .build();

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(dto);

        System.out.println("🧪 JSON generado: " + json);

        assertTrue(json.contains("\"originId\":1"));
        assertTrue(json.contains("\"requestAmount\":10"));
        assertTrue(json.contains("\"name\":\"Mantenimiento Urbano\""));
        assertTrue(json.contains("\"reason\":\"Baches en Vista Hermosa\""));
        assertTrue(json.contains("\"requestDate\":\"2025-10-12\""));
        assertTrue(json.contains("\"email\":\"joelmorales05982@gmail.com\""));
        assertTrue(json.contains("\"priorityId\":3"));
    }
}