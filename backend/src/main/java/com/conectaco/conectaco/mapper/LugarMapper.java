package com.conectaco.conectaco.mapper;

import com.conectaco.conectaco.dto.LugarDTO;
import com.conectaco.conectaco.dto.LugarRequest;
import com.conectaco.conectaco.entity.LugarEntity;

public interface LugarMapper {
    LugarDTO toLugarDTO(LugarEntity lugar, String categoria, long opiniones, long actividades, boolean favorito);

    void copiar(LugarRequest request, LugarEntity lugar);
}
