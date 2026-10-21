package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Recuerdo")
public class RecuerdoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recuerdo")
    private Integer idRecuerdo;
    @Column(nullable = false)
    private String titulo;
    @Column(nullable = false, length = 500)
    private String resena;
    private Integer calificacion;
    @Column(nullable = false)
    private LocalDate fecha;
    @Column(name = "imagen_url")
    private String imagenUrl;
    @Column(name = "cancion_url")
    private String cancionUrl;
    @Column(name = "fk_id_turista", nullable = false)
    private Integer idTurista;
    @Column(name = "fk_id_lugar", nullable = false)
    private Integer idLugar;

    public Integer getIdRecuerdo() { return idRecuerdo; }
    public void setIdRecuerdo(Integer idRecuerdo) { this.idRecuerdo = idRecuerdo; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getResena() { return resena; }
    public void setResena(String resena) { this.resena = resena; }
    public Integer getCalificacion() { return calificacion; }
    public void setCalificacion(Integer calificacion) { this.calificacion = calificacion; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public String getCancionUrl() { return cancionUrl; }
    public void setCancionUrl(String cancionUrl) { this.cancionUrl = cancionUrl; }
    public Integer getIdTurista() { return idTurista; }
    public void setIdTurista(Integer idTurista) { this.idTurista = idTurista; }
    public Integer getIdLugar() { return idLugar; }
    public void setIdLugar(Integer idLugar) { this.idLugar = idLugar; }
}
