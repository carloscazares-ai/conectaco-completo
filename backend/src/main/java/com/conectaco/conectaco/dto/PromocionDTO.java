package com.conectaco.conectaco.dto;

import java.time.LocalDate;

public record PromocionDTO(Integer idPromocion, String titulo, String descripcion, LocalDate fechaFin, Boolean activa,
                           String imagenUrl, Integer idNegocio, String negocio, Integer idLugar, boolean vigente) {
}
