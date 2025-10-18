package proyecto.MantenimientoUrbano_Backend.application.test;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import proyecto.MantenimientoUrbano_Backend.application.service.NotificarCambioEstadoService;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.ParticipacionGateway;

import static org.mockito.Mockito.*;

public class NotificarCambioEstadoServiceTest {

    private ParticipacionGateway mockGateway;
    private NotificarCambioEstadoService service;

    @BeforeEach
    void setUp() {
        mockGateway = Mockito.mock(ParticipacionGateway.class);
        service = new NotificarCambioEstadoService(mockGateway);
    }

    @Test
    void testEstadoNotificableDisparaNotificacion() {
        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(1L)
                .estado(EstadoSolicitud.PROGRAMADA)
                .build();

        service.notificarSiAplica(solicitud);

        verify(mockGateway, times(1)).enviarNotificacion(any());
    }

    @Test
    void testEstadoNoNotificableNoHaceNada() {
        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(2L)
                .estado(EstadoSolicitud.PENDIENTE)
                .build();

        service.notificarSiAplica(solicitud);

        verify(mockGateway, never()).enviarNotificacion(any());
    }
}