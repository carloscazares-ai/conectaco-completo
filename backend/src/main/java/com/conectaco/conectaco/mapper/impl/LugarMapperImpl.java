package com.conectaco.conectaco.mapper.impl;

import com.conectaco.conectaco.dto.LugarDTO;
import com.conectaco.conectaco.dto.LugarRequest;
import com.conectaco.conectaco.entity.LugarEntity;
import com.conectaco.conectaco.mapper.LugarMapper;
import org.springframework.stereotype.Component;

@Component
public class LugarMapperImpl implements LugarMapper {

    @Override
    public LugarDTO toLugarDTO(LugarEntity lugar, String categoria, long opiniones, long actividades, boolean favorito) {
        return new LugarDTO(lugar.getIdLugar(), lugar.getNombre(), lugar.getDescripcion(), lugar.getDireccion(),
                lugar.getLatitud(), lugar.getLongitud(), lugar.getHorario(), lugar.getCosto(),
                lugar.getCalificacionPromedio(), lugar.getImagenUrl(), lugar.getIdCategoria(), categoria,
                lugar.getIdNegocio(), opiniones, actividades, favorito);
    }

    @Override
    public void copiar(LugarRequest request, LugarEntity lugar) {
        lugar.setNombre(request.nombre());
        lugar.setDescripcion(request.descripcion());
        lugar.setDireccion(request.direccion());
        lugar.setLatitud(request.latitud());
        lugar.setLongitud(request.longitud());
        lugar.setHorario(request.horario());
        lugar.setCosto(request.costo());
        lugar.setImagenUrl(request.imagenUrl());
        lugar.setIdCategoria(request.idCategoria());
    }
}
