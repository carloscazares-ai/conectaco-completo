package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Favorito")
public class FavoritoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_favorito")
    private Integer idFavorito;
    @Column(nullable = false)
    private LocalDateTime fecha;
    @Column(name = "fk_id_turista", nullable = false)
    private Integer idTurista;
    @Column(name = "fk_id_lugar", nullable = false)
    private Integer idLugar;

    public Integer getIdFavorito() { return idFavorito; }
    public void setIdFavorito(Integer idFavorito) { this.idFavorito = idFavorito; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public Integer getIdTurista() { return idTurista; }
    public void setIdTurista(Integer idTurista) { this.idTurista = idTurista; }
    public Integer getIdLugar() { return idLugar; }
    public void setIdLugar(Integer idLugar) { this.idLugar = idLugar; }
}
