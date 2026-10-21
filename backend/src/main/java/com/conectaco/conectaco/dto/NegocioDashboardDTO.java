package com.conectaco.conectaco.dto;

import java.util.List;

public record NegocioDashboardDTO(String nombre, LugarDTO lugar, long visitas, long actividades, long seguidores,
                                  List<PuntoSerieDTO> visitasUltimos30Dias) {
}
