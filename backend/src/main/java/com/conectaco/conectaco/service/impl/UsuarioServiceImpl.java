package com.conectaco.conectaco.service.impl;

import com.conectaco.conectaco.dto.RegistroRequest;
import com.conectaco.conectaco.dto.UsuarioDTO;
import com.conectaco.conectaco.entity.UsuarioEntity;
import com.conectaco.conectaco.mapper.UsuarioMapper;
import com.conectaco.conectaco.repository.UsuarioRepository;
import com.conectaco.conectaco.service.AuthService;
import com.conectaco.conectaco.service.UsuarioService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioMapper usuarioMapper;
    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    public UsuarioServiceImpl(UsuarioMapper usuarioMapper, UsuarioRepository usuarioRepository,
                              AuthService authService) {
        this.usuarioMapper = usuarioMapper;
        this.usuarioRepository = usuarioRepository;
        this.authService = authService;
    }

    // Igual que el registro: valida, cifra la contrasena y crea su Turista o Negocio
    @Override
    public UsuarioDTO save(UsuarioDTO usuarioDTO) {
        RegistroRequest request = new RegistroRequest(usuarioDTO.getNombre(), usuarioDTO.getEmail(),
                usuarioDTO.getPassword(), usuarioDTO.getTipoUsuario());
        UsuarioEntity usuarioEntity = authService.registrarUsuario(request);
        return usuarioMapper.toUsuarioDTO(usuarioEntity);
    }

    @Override
    public List<UsuarioDTO> findAll() {
        List<UsuarioEntity> usuarioEntities = usuarioRepository.findAll();

        List<UsuarioDTO> usuarioDTOs = new ArrayList<>();

        for (UsuarioEntity usuarioEntity : usuarioEntities) {
            usuarioDTOs.add(usuarioMapper.toUsuarioDTO(usuarioEntity));
        }

        return usuarioDTOs;
    }
}
