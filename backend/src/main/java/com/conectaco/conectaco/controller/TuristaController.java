package com.conectaco.conectaco.controller;

import com.conectaco.conectaco.dto.*;
import com.conectaco.conectaco.service.RecuerdoService;
import com.conectaco.conectaco.service.TuristaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/turistas/{idTurista}")
public class TuristaController {

    private final TuristaService turistaService;
    private final RecuerdoService recuerdoService;

    public TuristaController(TuristaService turistaService, RecuerdoService recuerdoService) {
        this.turistaService = turistaService;
        this.recuerdoService = recuerdoService;
    }

    @GetMapping("/dashboard")
    public TuristaDashboardDTO dashboard(@PathVariable Integer idTurista) {
        return turistaService.dashboard(idTurista);
    }

    // filtro: todas | disponibles | completadas
    @GetMapping("/misiones")
    public List<MisionDTO> misiones(@PathVariable Integer idTurista,
                                    @RequestParam(defaultValue = "todas") String filtro) {
        return turistaService.misiones(idTurista, filtro);
    }

    @PostMapping("/misiones/{idMision}/completar")
    public MisionCompletadaDTO completar(@PathVariable Integer idTurista, @PathVariable Integer idMision) {
        return turistaService.completarMision(idTurista, idMision);
    }

    @GetMapping("/favoritos")
    public List<LugarDTO> favoritos(@PathVariable Integer idTurista) {
        return turistaService.favoritos(idTurista);
    }

    // Si ya estaba guardado lo quita, si no lo guarda
    @PostMapping("/favoritos/{idLugar}")
    public LugarDTO alternarFavorito(@PathVariable Integer idTurista, @PathVariable Integer idLugar) {
        return turistaService.alternarFavorito(idTurista, idLugar);
    }

    @GetMapping("/mascota")
    public MascotaDTO mascota(@PathVariable Integer idTurista) {
        return turistaService.mascota(idTurista);
    }

    @PutMapping("/mascota")
    public MascotaDTO actualizarMascota(@PathVariable Integer idTurista, @RequestBody MascotaRequest request) {
        return turistaService.actualizarMascota(idTurista, request);
    }

    // accion: alimentar | jugar
    @PostMapping("/mascota/{accion}")
    public MascotaDTO cuidarMascota(@PathVariable Integer idTurista, @PathVariable String accion) {
        return turistaService.cuidarMascota(idTurista, accion);
    }

    @GetMapping("/recompensas")
    public List<RecompensaDTO> recompensas(@PathVariable Integer idTurista) {
        return turistaService.recompensas(idTurista);
    }

    @PostMapping("/recompensas/{idRecompensa}/canjear")
    public RecompensaDTO canjear(@PathVariable Integer idTurista, @PathVariable Integer idRecompensa) {
        return turistaService.canjearRecompensa(idTurista, idRecompensa);
    }

    @GetMapping("/recuerdos")
    public List<RecuerdoDTO> recuerdos(@PathVariable Integer idTurista) {
        return recuerdoService.listar(idTurista);
    }

    @PostMapping("/recuerdos")
    @ResponseStatus(HttpStatus.CREATED)
    public RecuerdoDTO crearRecuerdo(@PathVariable Integer idTurista, @RequestBody RecuerdoRequest request) {
        return recuerdoService.crear(idTurista, request);
    }

    @DeleteMapping("/recuerdos/{idRecuerdo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarRecuerdo(@PathVariable Integer idTurista, @PathVariable Integer idRecuerdo) {
        recuerdoService.eliminar(idTurista, idRecuerdo);
    }
}
