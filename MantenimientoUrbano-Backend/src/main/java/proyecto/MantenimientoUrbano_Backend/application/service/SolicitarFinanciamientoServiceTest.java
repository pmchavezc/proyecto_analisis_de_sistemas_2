package proyecto.MantenimientoUrbano_Backend.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import proyecto.MantenimientoUrbano_Backend.domain.model.*;
import proyecto.MantenimientoUrbano_Backend.domain.port.PortalFinanzas;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class SolicitarFinanciamientoServiceTest {

    private PortalFinanzas mockFinanzas;
    private SolicitudRepository mockRepository;
    private SolicitarFinanciamientoService service;

    @BeforeEach
    void setUp() {
        mockFinanzas = Mockito.mock(PortalFinanzas.class);
        mockRepository = Mockito.mock(SolicitudRepository.class);
        service = new SolicitarFinanciamientoService(mockFinanzas, mockRepository);
    }

    @Test
    void testFinanciamientoExitoso() {
        // Arrange
        Long solicitudId = 1L;

        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(solicitudId)
                .tipo("bache")
                .descripcion("Hueco en calle")
                .ubicacion("Zona 1")
                .prioridad(Prioridad.ALTA)
                .estado(EstadoSolicitud.PROGRAMADA)
                .estadoFinanciero(EstadoFinanciamiento.PENDIENTE)
                .fechaRegistro(LocalDate.now())
                .fuente("Participacion")
                .reporteIdExtern(100L)
                .build();

        SolicitudFinanciamientoRequest request = SolicitudFinanciamientoRequest.builder()
                .idSolicitud(solicitudId)
                .tipoGasto("Infraestructura")
                .montoEstimado(BigDecimal.valueOf(5000))
                .adjuntos(List.of())
                .build();

        SolicitudFinanciamientoResponse response = SolicitudFinanciamientoResponse.builder()
                .idTransaccion("TX-001")
                .estado(EstadoFinanciamiento.APROBADO)
                .montoAutorizado(BigDecimal.valueOf(5000))
                .motivo("Autorizado")
                .fechaSolicitud(LocalDate.now())
                .fechaDecision(LocalDate.now())
                .build();

        Mockito.when(mockRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
        Mockito.when(mockFinanzas.solicitarFinanciamiento(request)).thenReturn(response);

        // Act
        SolicitudFinanciamientoResponse resultado = service.solicitarFinanciamiento(request);

        // Assert
        assertEquals(EstadoFinanciamiento.APROBADO, resultado.getEstado());

        ArgumentCaptor<SolicitudMantenimiento> captor = ArgumentCaptor.forClass(SolicitudMantenimiento.class);
        Mockito.verify(mockRepository).save(captor.capture());

        SolicitudMantenimiento solicitudGuardada = captor.getValue();
        assertEquals(solicitudId, solicitudGuardada.getId());
        assertEquals(EstadoFinanciamiento.FINANCIADA, solicitudGuardada.getEstadoFinanciero());
    }

    @Test
    void testSolicitudNoProgramadaLanzaExcepcion() {
        // Arrange
        Long solicitudId = 2L;

        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(solicitudId)
                .estado(EstadoSolicitud.PENDIENTE)
                .build();

        SolicitudFinanciamientoRequest request = SolicitudFinanciamientoRequest.builder()
                .idSolicitud(solicitudId)
                .tipoGasto("Materiales")
                .montoEstimado(BigDecimal.valueOf(3000))
                .build();

        Mockito.when(mockRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));

        // Act & Assert
        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                service.solicitarFinanciamiento(request));

        assertEquals("Solo se puede solicitar financiamiento si la solicitud está programada", ex.getMessage());
    }

    @Test
    void testSolicitudNoExisteLanzaExcepcion() {
        // Arrange
        Long solicitudId = 999L;

        SolicitudFinanciamientoRequest request = SolicitudFinanciamientoRequest.builder()
                .idSolicitud(solicitudId)
                .tipoGasto("Materiales")
                .montoEstimado(BigDecimal.valueOf(3000))
                .build();

        Mockito.when(mockRepository.findById(solicitudId)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.solicitarFinanciamiento(request));

        assertEquals("Solicitud no encontrada", ex.getMessage());
    }
}
