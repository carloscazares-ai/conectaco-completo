package com.conectaco.conectaco.dto;

public record RecompensaDTO(Integer idRecompensa, String nombre, String tipo, String descripcion, String imagenUrl,
                            Integer requisitoXp, boolean desbloqueada, boolean canjeada, boolean equipada) {
}
