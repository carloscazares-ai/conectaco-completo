package com.conectaco.conectaco.mapper.impl;

import com.conectaco.conectaco.dto.MascotaDTO;
import com.conectaco.conectaco.entity.MascotaEntity;
import com.conectaco.conectaco.mapper.MascotaMapper;
import com.conectaco.conectaco.util.Niveles;
import org.springframework.stereotype.Component;

@Component
public class MascotaMapperImpl implements MascotaMapper {

    @Override
    public MascotaDTO toMascotaDTO(MascotaEntity mascota, String accesorio) {
        return new MascotaDTO(mascota.getIdMascota(), mascota.getNombre(), mascota.getNivel(),
                mascota.getExperiencia(), Niveles.xpEnNivel(mascota.getExperiencia()), Niveles.XP_POR_NIVEL,
                mascota.getIdRecompensaEquipada(), accesorio);
    }
}
