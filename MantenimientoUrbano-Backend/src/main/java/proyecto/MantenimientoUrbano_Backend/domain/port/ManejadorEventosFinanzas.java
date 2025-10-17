package proyecto.MantenimientoUrbano_Backend.domain.port;

import proyecto.MantenimientoUrbano_Backend.domain.model.ConfirmacionFinanzasEvent;

public interface ManejadorEventosFinanzas {
    void conConfirmacionFinanciamiento(ConfirmacionFinanzasEvent event);
}