package com.conectaco.conectaco.mapper.impl;

import com.conectaco.conectaco.dto.UsuarioDTO;
import com.conectaco.conectaco.entity.UsuarioEntity;
import com.conectaco.conectaco.mapper.UsuarioMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    @Override
    public UsuarioEntity toUsuarioEntity(UsuarioDTO usuarioDTO) {
        UsuarioEntity usuarioEntity = new UsuarioEntity();

        BeanUtils.copyProperties(usuarioDTO, usuarioEntity);

        return usuarioEntity;
    }

    @Override
    public UsuarioDTO toUsuarioDTO(UsuarioEntity usuarioEntity) {
        UsuarioDTO usuarioDTO = new UsuarioDTO();

        BeanUtils.copyProperties(usuarioEntity, usuarioDTO);

        return usuarioDTO;
    }
}
