package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Promocion")
public class PromocionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocion")
    private Integer idPromocion;
    @Column(nullable = false)
    private String titulo;
    private String descripcion;
    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;
    @Column(nullable = false)
    private Boolean activa;
    @Column(name = "imagen_url")
    private String imagenUrl;
    @Column(name = "fk_id_negocio", nullable = false)
    private Integer idNegocio;

    public Integer getIdPromocion() { return idPromocion; }
    public void setIdPromocion(Integer idPromocion) { this.idPromocion = idPromocion; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public Integer getIdNegocio() { return idNegocio; }
    public void setIdNegocio(Integer idNegocio) { this.idNegocio = idNegocio; }
}
