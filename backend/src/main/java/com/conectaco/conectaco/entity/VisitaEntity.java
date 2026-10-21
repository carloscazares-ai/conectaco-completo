package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Visita")
public class VisitaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_visita")
    private Integer idVisita;
    @Column(nullable = false)
    private LocalDateTime fecha;
    @Column(name = "fk_id_turista")
    private Integer idTurista;
    @Column(name = "fk_id_lugar", nullable = false)
    private Integer idLugar;

    public Integer getIdVisita() { return idVisita; }
    public void setIdVisita(Integer idVisita) { this.idVisita = idVisita; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public Integer getIdTurista() { return idTurista; }
    public void setIdTurista(Integer idTurista) { this.idTurista = idTurista; }
    public Integer getIdLugar() { return idLugar; }
    public void setIdLugar(Integer idLugar) { this.idLugar = idLugar; }
}
