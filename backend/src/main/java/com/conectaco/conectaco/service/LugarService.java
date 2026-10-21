package com.conectaco.conectaco.service;

import com.conectaco.conectaco.dto.CategoriaDTO;
import com.conectaco.conectaco.dto.LugarDTO;
import com.conectaco.conectaco.dto.MisionDTO;
import com.conectaco.conectaco.dto.RecuerdoDTO;
import com.conectaco.conectaco.entity.LugarEntity;

import java.util.List;

public interface LugarService {
    List<CategoriaDTO> categorias();

    List<LugarDTO> listar(Integer idCategoria, String busqueda, Integer idTurista);

    LugarDTO detalle(Integer idLugar, Integer idTurista);

    List<MisionDTO> misiones(Integer idLugar, Integer idTurista);

    List<RecuerdoDTO> opiniones(Integer idLugar);

    LugarDTO toDTO(LugarEntity lugar, Integer idTurista);

    LugarEntity buscar(Integer idLugar);
}
