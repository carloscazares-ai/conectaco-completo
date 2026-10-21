package com.conectaco.conectaco.dto;

import java.util.List;

public record TuristaDashboardDTO(String nombre, Integer xp, Integer nivel, long lugaresVisitados, long recuerdos,
                                  long recompensas, MascotaDTO mascota, List<LugarDTO> recomendados,
                                  List<PromocionDTO> promociones) {
}
