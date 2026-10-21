package com.conectaco.conectaco.mapper.impl;

import com.conectaco.conectaco.dto.PromocionDTO;
import com.conectaco.conectaco.dto.PromocionRequest;
import com.conectaco.conectaco.entity.PromocionEntity;
import com.conectaco.conectaco.mapper.PromocionMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PromocionMapperImpl implements PromocionMapper {

    @Override
    public PromocionDTO toPromocionDTO(PromocionEntity promocion, String negocio, Integer idLugar) {
        boolean vigente = Boolean.TRUE.equals(promocion.getActiva())
                && !promocion.getFechaFin().isBefore(LocalDate.now());
        return new PromocionDTO(promocion.getIdPromocion(), promocion.getTitulo(), promocion.getDescripcion(),
                promocion.getFechaFin(), promocion.getActiva(), promocion.getImagenUrl(), promocion.getIdNegocio(),
                negocio, idLugar, vigente);
    }

    @Override
    public void copiar(PromocionRequest request, PromocionEntity promocion) {
        promocion.setTitulo(request.titulo());
        promocion.setDescripcion(request.descripcion());
        promocion.setFechaFin(request.fechaFin());
        promocion.setActiva(request.activa() == null || request.activa());
        promocion.setImagenUrl(request.imagenUrl());
    }
}
