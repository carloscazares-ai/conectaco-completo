package com.conectaco.conectaco.mapper;

import com.conectaco.conectaco.dto.RecuerdoDTO;
import com.conectaco.conectaco.dto.RecuerdoRequest;
import com.conectaco.conectaco.entity.RecuerdoEntity;

public interface RecuerdoMapper {
    RecuerdoDTO toRecuerdoDTO(RecuerdoEntity recuerdo, String lugar, String autor);

    RecuerdoEntity toRecuerdoEntity(RecuerdoRequest request, Integer idTurista);
}
