package com.conectaco.conectaco.dto;

import com.conectaco.conectaco.enums.TipoUsuario;

// Lo que manda la pantalla "Crear cuenta". Para un negocio, nombre = nombre del negocio.
public record RegistroRequest(String nombre, String email, String password, TipoUsuario tipoUsuario) {
}
