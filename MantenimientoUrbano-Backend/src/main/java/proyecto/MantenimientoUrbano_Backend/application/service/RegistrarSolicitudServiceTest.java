package proyecto.MantenimientoUrbano_Backend.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import proyecto.MantenimientoUrbano_Backend.application.dto.RegistrarSolicitudRequest;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.Prioridad;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


public class RegistrarSolicitudServiceTest {

    private SolicitudRepository mockRepository;
    private RegistrarSolicitudService service;

    @BeforeEach
    void setUp() {
        mockRepository = Mockito.mock(SolicitudRepository.class);
        service = new RegistrarSolicitudService(mockRepository);
    }

    @Test
    void testRegistrarSolicitudValida() {
        // Arrange
        RegistrarSolicitudRequest request = RegistrarSolicitudRequest.builder()
                .tipo("bache")
                .descripcion("Hueco en calle 10")
                .ubicacion("Zona 3")
                .prioridad("ALTA")
                .fuente("Participacion")
                .reporteIdExtern(101L)
                .build();

        Mockito.when(mockRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SolicitudMantenimiento resultado = service.registrar(request);

        // Assert
        assertEquals("bache", resultado.getTipo());
        assertEquals("Hueco en calle 10", resultado.getDescripcion());
        assertEquals("Zona 3", resultado.getUbicacion());
        assertEquals(Prioridad.ALTA, resultado.getPrioridad());
        assertEquals(EstadoSolicitud.PENDIENTE, resultado.getEstado());
        assertEquals("Participacion", resultado.getFuente());
        assertEquals(101L, resultado.getReporteIdExtern());
        assertEquals(EstadoFinanciamiento.PENDIENTE, resultado.getEstadoFinanciero()); // ✅ nuevo campo
        assertNotNull(resultado.getFechaRegistro());
}
}