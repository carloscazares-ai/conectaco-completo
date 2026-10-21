package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Mascota")
public class MascotaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mascota")
    private Integer idMascota;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private Integer nivel;
    @Column(nullable = false)
    private Integer experiencia;
    @Column(name = "fk_id_turista", nullable = false)
    private Integer idTurista;
    @Column(name = "fk_id_recompensa_equipada")
    private Integer idRecompensaEquipada;

    public Integer getIdMascota() { return idMascota; }
    public void setIdMascota(Integer idMascota) { this.idMascota = idMascota; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getNivel() { return nivel; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }
    public Integer getExperiencia() { return experiencia; }
    public void setExperiencia(Integer experiencia) { this.experiencia = experiencia; }
    public Integer getIdTurista() { return idTurista; }
    public void setIdTurista(Integer idTurista) { this.idTurista = idTurista; }
    public Integer getIdRecompensaEquipada() { return idRecompensaEquipada; }
    public void setIdRecompensaEquipada(Integer idRecompensaEquipada) { this.idRecompensaEquipada = idRecompensaEquipada; }
}
