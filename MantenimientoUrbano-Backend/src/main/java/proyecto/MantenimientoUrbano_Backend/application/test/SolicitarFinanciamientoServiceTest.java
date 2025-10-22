package proyecto.MantenimientoUrbano_Backend.application.test;

import org.junit.jupiter.api.Test;
import proyecto.MantenimientoUrbano_Backend.application.service.SolicitarFinanciamientoService;
import proyecto.MantenimientoUrbano_Backend.domain.model.*;
import proyecto.MantenimientoUrbano_Backend.domain.port.PortalFinanzas;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SolicitarFinanciamientoServiceTest {

    @Test
    void testSolicitarFinanciamiento_actualizaEstadoYFinanciamiento() {
        // Arrange
        PortalFinanzas portalFinanzas = mock(PortalFinanzas.class);
        SolicitudRepository solicitudRepository = mock(SolicitudRepository.class);
        SolicitarFinanciamientoService service = new SolicitarFinanciamientoService(portalFinanzas, solicitudRepository);

        Long solicitudId = 5L;

        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(solicitudId)
                .estado(EstadoSolicitud.PROGRAMADA)
                .estadoFinanciero(EstadoFinanciamiento.PENDIENTE)
                .idFinanciamiento(null)
                .build();

        SolicitudFinanciamientoRequest request = SolicitudFinanciamientoRequest.builder()
                .originId(1L) // ← Este valor es para Finanzas, no para buscar la solicitud
                .requestAmount(BigDecimal.valueOf(1000))
                .name("Mantenimiento Urbano")
                .reason("Baches Sajcavilla")
                .requestDate("2025-01-01")
                .email("joelmorales05982@gmail.com")
                .priorityId(3)
                .build();

        SolicitudFinanciamientoResponse respuesta = SolicitudFinanciamientoResponse.builder()
                .idTransaccion("41")
                .estado(EstadoFinanciamiento.EN_ESPERA_FINANCIAMIENTO)
                .montoAutorizado(BigDecimal.valueOf(1000))
                .fechaSolicitud(LocalDate.of(2025, 1, 1))
                .build();

        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
        when(portalFinanzas.solicitarFinanciamiento(request)).thenReturn(respuesta);

        // Act
        SolicitudFinanciamientoResponse result = service.solicitarFinanciamiento(request, solicitudId);

        // Assert
        assertEquals("41", result.getIdTransaccion());
        assertEquals(EstadoFinanciamiento.EN_ESPERA_FINANCIAMIENTO, result.getEstado());

        verify(solicitudRepository).actualizarEstadoFinanciero(
                eq(solicitudId),
                eq(EstadoFinanciamiento.EN_ESPERA_FINANCIAMIENTO),
                eq(41L)
        );
    }

    @Test
    void testSolicitarFinanciamiento_lanzaExcepcionSiNoProgramada() {
        PortalFinanzas portalFinanzas = mock(PortalFinanzas.class);
        SolicitudRepository solicitudRepository = mock(SolicitudRepository.class);
        SolicitarFinanciamientoService service = new SolicitarFinanciamientoService(portalFinanzas, solicitudRepository);

        Long solicitudId = 5L;

        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(solicitudId)
                .estado(EstadoSolicitud.PENDIENTE)
                .build();

        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));

        SolicitudFinanciamientoRequest request = SolicitudFinanciamientoRequest.builder()
                .originId(1L)
                .build();

        assertThrows(IllegalStateException.class, () -> service.solicitarFinanciamiento(request, solicitudId));
    }
}
