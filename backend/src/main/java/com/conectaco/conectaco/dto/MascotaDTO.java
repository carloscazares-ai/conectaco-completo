package com.conectaco.conectaco.dto;

// xpEnNivel / xpPorNivel es la barra de progreso (ej. 250 / 500 XP)
public record MascotaDTO(Integer idMascota, String nombre, Integer nivel, Integer experiencia,
                         Integer xpEnNivel, Integer xpPorNivel, Integer idRecompensaEquipada, String accesorio) {
}
