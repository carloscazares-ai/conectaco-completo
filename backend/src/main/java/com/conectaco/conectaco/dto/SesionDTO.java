package com.conectaco.conectaco.dto;

import com.conectaco.conectaco.enums.TipoUsuario;

// Lo que regresa el login/registro. El frontend lo guarda para saber quien esta conectado.
public record SesionDTO(Integer idUsuario, String nombre, String email, TipoUsuario tipoUsuario,
                        Integer idTurista, Integer idNegocio) {
}
