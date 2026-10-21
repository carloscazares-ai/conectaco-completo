package com.conectaco.conectaco.dto;

import com.conectaco.conectaco.enums.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class UsuarioDTO {
    private Integer idUsuario;
    private String nombre;
    private String email;
    // La contrasena se recibe pero nunca se regresa en las respuestas
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private TipoUsuario tipoUsuario;
    private LocalDate fechaRegistro;

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}
