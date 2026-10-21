package com.conectaco.conectaco.service;

import com.conectaco.conectaco.dto.UsuarioDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioDTO save(UsuarioDTO usuarioDTO);
    List<UsuarioDTO> findAll();

}
