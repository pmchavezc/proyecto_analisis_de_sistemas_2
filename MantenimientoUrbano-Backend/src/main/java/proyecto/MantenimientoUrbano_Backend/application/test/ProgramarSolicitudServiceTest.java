package proyecto.MantenimientoUrbano_Backend.application.test;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import proyecto.MantenimientoUrbano_Backend.application.dto.ProgramacionRequest;
import proyecto.MantenimientoUrbano_Backend.application.service.ProgramarSolicitudService;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProgramarSolicitudServiceTest {

    private SolicitudRepository mockRepository;
    private ProgramarSolicitudService service;

    @BeforeEach
    void setUp() {
        mockRepository = Mockito.mock(SolicitudRepository.class);
        service = new ProgramarSolicitudService(mockRepository);
    }

    @Test
    void testProgramacionExitosa() {
        Long id = 1L;
        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(id)
                .estado(EstadoSolicitud.PENDIENTE)
                .estadoFinanciero(EstadoFinanciamiento.FINANCIADA)
                .build();

        ProgramacionRequest request = ProgramacionRequest.builder()
                .fechaInicio(LocalDate.now().plusDays(1))
                .cuadrilla("Cuadrilla A")
                .recursos(List.of("Asfalto", "Herramientas"))
                .build();

        when(mockRepository.findById(id)).thenReturn(Optional.of(solicitud));

        service.programar(id, request);

        verify(mockRepository).save(argThat(s ->
                s.getEstado() == EstadoSolicitud.PROGRAMADA &&
                        s.getCuadrillaAsignada().equals("Cuadrilla A")
        ));
    }

    @Test
    void testFechaInvalidaLanzaExcepcion() {
        Long id = 2L;
        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(id)
                .estado(EstadoSolicitud.PENDIENTE)
                .estadoFinanciero(EstadoFinanciamiento.FINANCIADA)
                .build();

        ProgramacionRequest request = ProgramacionRequest.builder()
                .fechaInicio(LocalDate.now().minusDays(1))
                .cuadrilla("Cuadrilla B")
                .build();

        when(mockRepository.findById(id)).thenReturn(Optional.of(solicitud));

        assertThrows(IllegalArgumentException.class, () -> service.programar(id, request));
    }

    @Test
    void testCuadrillaFaltanteLanzaExcepcion() {
        Long id = 3L;
        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(id)
                .estado(EstadoSolicitud.PENDIENTE)
                .estadoFinanciero(EstadoFinanciamiento.FINANCIADA)
                .build();

        ProgramacionRequest request = ProgramacionRequest.builder()
                .fechaInicio(LocalDate.now().plusDays(2))
                .cuadrilla("")
                .build();

        when(mockRepository.findById(id)).thenReturn(Optional.of(solicitud));

        assertThrows(IllegalArgumentException.class, () -> service.programar(id, request));
    }
}
