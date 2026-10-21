package com.conectaco.conectaco.service;

import com.conectaco.conectaco.dto.RecuerdoDTO;
import com.conectaco.conectaco.dto.RecuerdoRequest;

import java.util.List;

public interface RecuerdoService {
    List<RecuerdoDTO> listar(Integer idTurista);

    RecuerdoDTO crear(Integer idTurista, RecuerdoRequest request);

    void eliminar(Integer idTurista, Integer idRecuerdo);
}
