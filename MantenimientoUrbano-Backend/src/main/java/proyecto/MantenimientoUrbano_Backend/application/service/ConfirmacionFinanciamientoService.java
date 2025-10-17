package proyecto.MantenimientoUrbano_Backend.application.service;

import io.swagger.v3.oas.annotations.servers.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import proyecto.MantenimientoUrbano_Backend.domain.model.ConfirmacionFinanzasEvent;
import proyecto.MantenimientoUrbano_Backend.domain.model.SolicitudMantenimiento;
import proyecto.MantenimientoUrbano_Backend.domain.port.ManejadorEventosFinanzas;
import proyecto.MantenimientoUrbano_Backend.domain.port.SolicitudRepository;

@Service
@RequiredArgsConstructor
public class ConfirmacionFinanciamientoService implements ManejadorEventosFinanzas {

    private final SolicitudRepository solicitudRepository;

    @Override
    public void conConfirmacionFinanciamiento(ConfirmacionFinanzasEvent event) {
        SolicitudMantenimiento solicitud = solicitudRepository.findById(event.getIdSolicitud())
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        solicitud.setEstadoFinanciero(event.getEstado());

        solicitudRepository.save(solicitud);
    }
}
