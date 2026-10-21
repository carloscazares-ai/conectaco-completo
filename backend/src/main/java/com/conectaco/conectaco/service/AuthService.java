package com.conectaco.conectaco.service;

import com.conectaco.conectaco.dto.LoginRequest;
import com.conectaco.conectaco.dto.RegistroRequest;
import com.conectaco.conectaco.dto.SesionDTO;
import com.conectaco.conectaco.entity.UsuarioEntity;

public interface AuthService {
    SesionDTO registrar(RegistroRequest request);

    SesionDTO login(LoginRequest request);

    UsuarioEntity registrarUsuario(RegistroRequest request);
}
