package com.conectaco.conectaco.mapper.impl;

import com.conectaco.conectaco.dto.RecuerdoDTO;
import com.conectaco.conectaco.dto.RecuerdoRequest;
import com.conectaco.conectaco.entity.RecuerdoEntity;
import com.conectaco.conectaco.mapper.RecuerdoMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RecuerdoMapperImpl implements RecuerdoMapper {

    @Override
    public RecuerdoDTO toRecuerdoDTO(RecuerdoEntity recuerdo, String lugar, String autor) {
        return new RecuerdoDTO(recuerdo.getIdRecuerdo(), recuerdo.getTitulo(), recuerdo.getResena(),
                recuerdo.getCalificacion(), recuerdo.getFecha(), recuerdo.getImagenUrl(), recuerdo.getCancionUrl(),
                recuerdo.getIdLugar(), lugar, recuerdo.getIdTurista(), autor);
    }

    @Override
    public RecuerdoEntity toRecuerdoEntity(RecuerdoRequest request, Integer idTurista) {
        RecuerdoEntity recuerdo = new RecuerdoEntity();
        recuerdo.setTitulo(request.titulo());
        recuerdo.setResena(request.resena() == null ? "" : request.resena());
        recuerdo.setCalificacion(request.calificacion());
        recuerdo.setFecha(request.fecha() == null ? LocalDate.now() : request.fecha());
        recuerdo.setImagenUrl(request.imagenUrl());
        recuerdo.setCancionUrl(request.cancionUrl());
        recuerdo.setIdLugar(request.idLugar());
        recuerdo.setIdTurista(idTurista);
        return recuerdo;
    }
}
