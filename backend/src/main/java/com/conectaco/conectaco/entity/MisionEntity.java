package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Misiones")
public class MisionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mision")
    private Integer idMision;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String descripcion;
    @Column(nullable = false)
    private String tipo;
    @Column(name = "puntos_xp", nullable = false)
    private Integer puntosXp;
    @Column(nullable = false)
    private Boolean activa;
    @Column(name = "fk_id_lugar", nullable = false)
    private Integer idLugar;

    public Integer getIdMision() { return idMision; }
    public void setIdMision(Integer idMision) { this.idMision = idMision; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getPuntosXp() { return puntosXp; }
    public void setPuntosXp(Integer puntosXp) { this.puntosXp = puntosXp; }
    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    public Integer getIdLugar() { return idLugar; }
    public void setIdLugar(Integer idLugar) { this.idLugar = idLugar; }
}
