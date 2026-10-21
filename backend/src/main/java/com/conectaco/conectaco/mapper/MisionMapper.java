package com.conectaco.conectaco.mapper;

import com.conectaco.conectaco.dto.MisionDTO;
import com.conectaco.conectaco.entity.MisionEntity;
import com.conectaco.conectaco.entity.ProgresoMisionEntity;

public interface MisionMapper {
    MisionDTO toMisionDTO(MisionEntity mision, String lugar, ProgresoMisionEntity progreso);
}
