package proyecto.MantenimientoUrbano_Backend.application.test;

import org.junit.jupiter.api.Test;
import proyecto.MantenimientoUrbano_Backend.application.dto.RegistrarSolicitudRequest;
import proyecto.MantenimientoUrbano_Backend.application.service.RegistrarSolicitudService;
import proyecto.MantenimientoUrbano_Backend.domain.model.*;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


public class RegistrarSolicitudServiceTest  {

    @Test
    void testRegistrarSolicitud_guardaCorrectamente() {
        SolicitudRepository repository = mock(SolicitudRepository.class);
        RegistrarSolicitudService service = new RegistrarSolicitudService(repository);

        RegistrarSolicitudRequest request = RegistrarSolicitudRequest.builder()
                .tipo("Bacheo")
                .descripcion("Hueco en calle principal")
                .ubicacion("Zona 1")
                .prioridad("ALTA")
                .fuente("Vecino")
                .reporteIdExtern(Long.valueOf("EXT123"))
                .build();

        SolicitudMantenimiento solicitudEsperada = SolicitudMantenimiento.builder()
                .tipo("Bacheo")
                .descripcion("Hueco en calle principal")
                .ubicacion("Zona 1")
                .prioridad(Prioridad.ALTA)
                .estado(EstadoSolicitud.PENDIENTE)
                .estadoFinanciero(EstadoFinanciamiento.PENDIENTE)
                .fechaRegistro(LocalDate.now())
                .fuente("Vecino")
                .reporteIdExtern(Long.valueOf("EXT123"))
                .build();

        when(repository.save(any())).thenReturn(solicitudEsperada);

        SolicitudMantenimiento resultado = service.registrar(request);

        assertEquals("Bacheo", resultado.getTipo());
        assertEquals(Prioridad.ALTA, resultado.getPrioridad());
        assertEquals(EstadoFinanciamiento.PENDIENTE, resultado.getEstadoFinanciero());
        verify(repository).save(any());
    }
}