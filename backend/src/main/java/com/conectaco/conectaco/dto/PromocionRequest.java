package com.conectaco.conectaco.dto;

import java.time.LocalDate;

public record PromocionRequest(String titulo, String descripcion, LocalDate fechaFin, Boolean activa, String imagenUrl) {
}
