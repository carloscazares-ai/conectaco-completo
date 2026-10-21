package com.conectaco.conectaco.controller;

import com.conectaco.conectaco.dto.UsuarioDTO;
import com.conectaco.conectaco.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/usuarios")
    public UsuarioDTO save(@RequestBody UsuarioDTO usuarioDTO){
        UsuarioDTO newUsuarioDTO = usuarioService.save(usuarioDTO);
        return newUsuarioDTO;
    }

    @GetMapping("/usuarios")
    public List<UsuarioDTO> findAll(){
        return usuarioService.findAll();
    }
}
