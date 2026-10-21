package com.conectaco.conectaco.controller;

import com.conectaco.conectaco.dto.CategoriaDTO;
import com.conectaco.conectaco.dto.LugarDTO;
import com.conectaco.conectaco.dto.MisionDTO;
import com.conectaco.conectaco.dto.PromocionDTO;
import com.conectaco.conectaco.dto.RecuerdoDTO;
import com.conectaco.conectaco.service.LugarService;
import com.conectaco.conectaco.service.NegocioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
public class LugarController {

    private final LugarService lugarService;
    private final NegocioService negocioService;

    public LugarController(LugarService lugarService, NegocioService negocioService) {
        this.lugarService = lugarService;
        this.negocioService = negocioService;
    }

    @GetMapping("/categorias")
    public List<CategoriaDTO> categorias() {
        return lugarService.categorias();
    }

    // Ej: /v1/lugares?categoria=2&q=cafe&idTurista=1
    @GetMapping("/lugares")
    public List<LugarDTO> lugares(@RequestParam(required = false) Integer categoria,
                                  @RequestParam(required = false) String q,
                                  @RequestParam(required = false) Integer idTurista) {
        return lugarService.listar(categoria, q, idTurista);
    }

    @GetMapping("/lugares/{idLugar}")
    public LugarDTO lugar(@PathVariable Integer idLugar, @RequestParam(required = false) Integer idTurista) {
        return lugarService.detalle(idLugar, idTurista);
    }

    @GetMapping("/lugares/{idLugar}/misiones")
    public List<MisionDTO> misiones(@PathVariable Integer idLugar, @RequestParam(required = false) Integer idTurista) {
        return lugarService.misiones(idLugar, idTurista);
    }

    @GetMapping("/lugares/{idLugar}/opiniones")
    public List<RecuerdoDTO> opiniones(@PathVariable Integer idLugar) {
        return lugarService.opiniones(idLugar);
    }

    @GetMapping("/promociones")
    public List<PromocionDTO> promocionesVigentes() {
        return negocioService.promocionesVigentes();
    }
}
