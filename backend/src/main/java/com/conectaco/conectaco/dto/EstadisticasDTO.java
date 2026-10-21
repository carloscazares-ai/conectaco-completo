package com.conectaco.conectaco.dto;

import java.util.List;

// Los "cambio" son el porcentaje contra el periodo anterior del mismo tamano (null si antes era 0)
public record EstadisticasDTO(int dias, long visitas, Double cambioVisitas, long actividadesCompletadas,
                              Double cambioActividades, long nuevosSeguidores, Double cambioSeguidores,
                              List<PuntoSerieDTO> serieVisitas) {
}
