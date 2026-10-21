package com.conectaco.conectaco.dto;

import java.time.LocalDateTime;

// estado: null si el turista no la ha hecho, o PENDIENTE / EN_PROGRESO / COMPLETADA
public record MisionDTO(Integer idMision, String nombre, String descripcion, String tipo, Integer puntosXp,
                        Boolean activa, Integer idLugar, String lugar, String estado, LocalDateTime fechaCompletado) {
}
