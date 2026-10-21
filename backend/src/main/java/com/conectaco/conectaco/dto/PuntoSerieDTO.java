package com.conectaco.conectaco.dto;

import java.time.LocalDate;

// Un punto de la grafica: cuantas visitas hubo ese dia
public record PuntoSerieDTO(LocalDate fecha, long valor) {
}
