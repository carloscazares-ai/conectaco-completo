package com.conectaco.conectaco.mapper;

import com.conectaco.conectaco.dto.MascotaDTO;
import com.conectaco.conectaco.entity.MascotaEntity;

public interface MascotaMapper {
    MascotaDTO toMascotaDTO(MascotaEntity mascota, String accesorio);
}
