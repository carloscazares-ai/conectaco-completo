package com.conectaco.conectaco.dto;

import com.conectaco.conectaco.enums.EstadoVerificacion;

public record NegocioPerfilDTO(Integer idNegocio, String nombre, String email, String rfc, String telefono,
                               String horario, EstadoVerificacion estadoVerificacion, String categoria,
                               String direccion, String imagenUrl) {
}
