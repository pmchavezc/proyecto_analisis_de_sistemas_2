package proyecto.MantenimientoUrbano_Backend.application.test;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import proyecto.MantenimientoUrbano_Backend.application.service.ConfirmacionFinanciamientoService;
import proyecto.MantenimientoUrbano_Backend.domain.model.ConfirmacionFinanzasEvent;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoFinanciamiento;
import proyecto.MantenimientoUrbano_Backend.domain.model.EstadoSolicitud;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.Mockito.*;

public class ConfirmacionFinanciamientoServiceTest {

    private SolicitudRepository mockRepository;
    private ConfirmacionFinanciamientoService service;

    @BeforeEach
    void setUp(){
        mockRepository = Mockito.mock(SolicitudRepository.class);
        service = new ConfirmacionFinanciamientoService(mockRepository);
    }

    @Test
    void testActualizaEstadoFinanciero() {
        Long idSolicitud = 1L;

        SolicitudMantenimiento solicitud = SolicitudMantenimiento.builder()
                .id(idSolicitud)
                .estado(EstadoSolicitud.PROGRAMADA)
                .estadoFinanciero(EstadoFinanciamiento.PENDIENTE)
                .build();

        ConfirmacionFinanzasEvent evento = ConfirmacionFinanzasEvent.builder()
                .idSolicitud(idSolicitud)
                .estado(EstadoFinanciamiento.APROBADO)
                .montoAutorizado(BigDecimal.valueOf(5000))
                .fechaDecision(LocalDate.now())
                .build();

        when(mockRepository.findById(idSolicitud)).thenReturn(Optional.of(solicitud));

        service.conConfirmacionFinanciamiento(evento);

        verify(mockRepository).save(argThat(s ->
                s.getEstadoFinanciero() == EstadoFinanciamiento.APROBADO
        ));
    }

}
