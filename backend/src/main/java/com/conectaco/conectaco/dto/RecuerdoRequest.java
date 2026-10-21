package com.conectaco.conectaco.dto;

import java.time.LocalDate;

public record RecuerdoRequest(String titulo, String resena, Integer calificacion, LocalDate fecha,
                              String imagenUrl, String cancionUrl, Integer idLugar) {
}
