package com.conectaco.conectaco.dto;

// Datos de la pantalla "Mi establecimiento"
public record LugarRequest(String nombre, String descripcion, String direccion, Double latitud, Double longitud,
                           String horario, String costo, String imagenUrl, Integer idCategoria) {
}
