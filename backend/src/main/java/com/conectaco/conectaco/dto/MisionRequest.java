package com.conectaco.conectaco.dto;

// activa = false la guarda como borrador
public record MisionRequest(String nombre, String descripcion, String tipo, Integer puntosXp, Boolean activa) {
}
