package com.conectaco.conectaco.controller;

import com.conectaco.conectaco.dto.*;
import com.conectaco.conectaco.service.NegocioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/negocios/{idNegocio}")
public class NegocioController {

    private final NegocioService negocioService;

    public NegocioController(NegocioService negocioService) {
        this.negocioService = negocioService;
    }

    @GetMapping("/dashboard")
    public NegocioDashboardDTO dashboard(@PathVariable Integer idNegocio) {
        return negocioService.dashboard(idNegocio);
    }

    // Puede regresar vacio si el negocio aun no registra su establecimiento
    @GetMapping("/lugar")
    public LugarDTO lugar(@PathVariable Integer idNegocio) {
        return negocioService.lugar(idNegocio);
    }

    @PutMapping("/lugar")
    public LugarDTO guardarLugar(@PathVariable Integer idNegocio, @RequestBody LugarRequest request) {
        return negocioService.guardarLugar(idNegocio, request);
    }

    @GetMapping("/misiones")
    public List<MisionDTO> misiones(@PathVariable Integer idNegocio) {
        return negocioService.misiones(idNegocio);
    }

    @PostMapping("/misiones")
    @ResponseStatus(HttpStatus.CREATED)
    public MisionDTO crearMision(@PathVariable Integer idNegocio, @RequestBody MisionRequest request) {
        return negocioService.crearMision(idNegocio, request);
    }

    @PutMapping("/misiones/{idMision}")
    public MisionDTO actualizarMision(@PathVariable Integer idNegocio, @PathVariable Integer idMision,
                                      @RequestBody MisionRequest request) {
        return negocioService.actualizarMision(idNegocio, idMision, request);
    }

    @DeleteMapping("/misiones/{idMision}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarMision(@PathVariable Integer idNegocio, @PathVariable Integer idMision) {
        negocioService.eliminarMision(idNegocio, idMision);
    }

    @GetMapping("/promociones")
    public List<PromocionDTO> promociones(@PathVariable Integer idNegocio) {
        return negocioService.promociones(idNegocio);
    }

    @PostMapping("/promociones")
    @ResponseStatus(HttpStatus.CREATED)
    public PromocionDTO crearPromocion(@PathVariable Integer idNegocio, @RequestBody PromocionRequest request) {
        return negocioService.crearPromocion(idNegocio, request);
    }

    @PutMapping("/promociones/{idPromocion}")
    public PromocionDTO actualizarPromocion(@PathVariable Integer idNegocio, @PathVariable Integer idPromocion,
                                            @RequestBody PromocionRequest request) {
        return negocioService.actualizarPromocion(idNegocio, idPromocion, request);
    }

    @DeleteMapping("/promociones/{idPromocion}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPromocion(@PathVariable Integer idNegocio, @PathVariable Integer idPromocion) {
        negocioService.eliminarPromocion(idNegocio, idPromocion);
    }

    @GetMapping("/estadisticas")
    public EstadisticasDTO estadisticas(@PathVariable Integer idNegocio, @RequestParam(defaultValue = "30") int dias) {
        return negocioService.estadisticas(idNegocio, dias);
    }

    @GetMapping("/perfil")
    public NegocioPerfilDTO perfil(@PathVariable Integer idNegocio) {
        return negocioService.perfil(idNegocio);
    }

    @PutMapping("/perfil")
    public NegocioPerfilDTO actualizarPerfil(@PathVariable Integer idNegocio, @RequestBody NegocioPerfilRequest request) {
        return negocioService.actualizarPerfil(idNegocio, request);
    }
}
