package com.conectaco.conectaco.service;

import com.conectaco.conectaco.dto.*;

import java.util.List;

public interface TuristaService {
    TuristaDashboardDTO dashboard(Integer idTurista);

    // filtro: "todas", "disponibles" o "completadas"
    List<MisionDTO> misiones(Integer idTurista, String filtro);

    MisionCompletadaDTO completarMision(Integer idTurista, Integer idMision);

    List<LugarDTO> favoritos(Integer idTurista);

    LugarDTO alternarFavorito(Integer idTurista, Integer idLugar);

    MascotaDTO mascota(Integer idTurista);

    MascotaDTO actualizarMascota(Integer idTurista, MascotaRequest request);

    // accion: "alimentar" o "jugar"
    MascotaDTO cuidarMascota(Integer idTurista, String accion);

    List<RecompensaDTO> recompensas(Integer idTurista);

    RecompensaDTO canjearRecompensa(Integer idTurista, Integer idRecompensa);
}
