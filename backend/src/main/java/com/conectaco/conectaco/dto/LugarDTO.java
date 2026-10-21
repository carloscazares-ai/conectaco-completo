package com.conectaco.conectaco.dto;

public record LugarDTO(Integer idLugar, String nombre, String descripcion, String direccion,
                       Double latitud, Double longitud, String horario, String costo,
                       Double calificacionPromedio, String imagenUrl, Integer idCategoria, String categoria,
                       Integer idNegocio, long opiniones, long actividades, boolean favorito) {
}
