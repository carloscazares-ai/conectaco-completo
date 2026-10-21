package com.conectaco.conectaco.mapper;

import com.conectaco.conectaco.dto.UsuarioDTO;
import com.conectaco.conectaco.entity.UsuarioEntity;

public interface UsuarioMapper {
    UsuarioEntity toUsuarioEntity(UsuarioDTO usuarioDTO);

    UsuarioDTO toUsuarioDTO(UsuarioEntity usuarioEntity);
}
