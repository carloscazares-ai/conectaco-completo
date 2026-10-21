package com.conectaco.conectaco.dto;

import java.time.LocalDate;

public record RecuerdoDTO(Integer idRecuerdo, String titulo, String resena, Integer calificacion, LocalDate fecha,
                          String imagenUrl, String cancionUrl, Integer idLugar, String lugar,
                          Integer idTurista, String autor) {
}
