package com.conectaco.conectaco.mapper.impl;

import com.conectaco.conectaco.dto.MisionDTO;
import com.conectaco.conectaco.entity.MisionEntity;
import com.conectaco.conectaco.entity.ProgresoMisionEntity;
import com.conectaco.conectaco.mapper.MisionMapper;
import org.springframework.stereotype.Component;

@Component
public class MisionMapperImpl implements MisionMapper {

    @Override
    public MisionDTO toMisionDTO(MisionEntity mision, String lugar, ProgresoMisionEntity progreso) {
        String estado = progreso == null ? null : progreso.getEstado().name();
        return new MisionDTO(mision.getIdMision(), mision.getNombre(), mision.getDescripcion(), mision.getTipo(),
                mision.getPuntosXp(), mision.getActiva(), mision.getIdLugar(), lugar, estado,
                progreso == null ? null : progreso.getFechaCompletado());
    }
}
