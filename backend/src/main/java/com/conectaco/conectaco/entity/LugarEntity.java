package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Lugar")
public class LugarEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lugar")
    private Integer idLugar;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false, length = 500)
    private String descripcion;
    @Column(nullable = false)
    private String direccion;
    @Column(nullable = false)
    private Double latitud;
    @Column(nullable = false)
    private Double longitud;
    @Column(nullable = false)
    private String horario;
    @Column(nullable = false)
    private String costo;
    @Column(name = "calificacion_promedio", nullable = false)
    private Double calificacionPromedio;
    @Column(name = "imagen_url")
    private String imagenUrl;
    @Column(name = "fk_id_categoria", nullable = false)
    private Integer idCategoria;
    @Column(name = "fk_id_negocio")
    private Integer idNegocio;

    public Integer getIdLugar() { return idLugar; }
    public void setIdLugar(Integer idLugar) { this.idLugar = idLugar; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }
    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public String getCosto() { return costo; }
    public void setCosto(String costo) { this.costo = costo; }
    public Double getCalificacionPromedio() { return calificacionPromedio; }
    public void setCalificacionPromedio(Double calificacionPromedio) { this.calificacionPromedio = calificacionPromedio; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public Integer getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Integer idCategoria) { this.idCategoria = idCategoria; }
    public Integer getIdNegocio() { return idNegocio; }
    public void setIdNegocio(Integer idNegocio) { this.idNegocio = idNegocio; }
}
