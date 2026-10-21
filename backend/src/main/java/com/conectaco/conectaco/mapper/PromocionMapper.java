package com.conectaco.conectaco.mapper;

import com.conectaco.conectaco.dto.PromocionDTO;
import com.conectaco.conectaco.dto.PromocionRequest;
import com.conectaco.conectaco.entity.PromocionEntity;

public interface PromocionMapper {
    PromocionDTO toPromocionDTO(PromocionEntity promocion, String negocio, Integer idLugar);

    void copiar(PromocionRequest request, PromocionEntity promocion);
}
