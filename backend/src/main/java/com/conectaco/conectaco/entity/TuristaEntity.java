package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Turistas")
public class TuristaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turista")
    private Integer idTurista;
    @Column(name = "idioma_preferido", nullable = false)
    private String idiomaPreferido;
    @Column(nullable = false)
    private Integer nivel;
    @Column(name = "puntos_experiencia", nullable = false)
    private Integer puntosExperiencia;
    @Column(name = "fk_id_usuario", nullable = false)
    private Integer idUsuario;

    public Integer getIdTurista() { return idTurista; }
    public void setIdTurista(Integer idTurista) { this.idTurista = idTurista; }
    public String getIdiomaPreferido() { return idiomaPreferido; }
    public void setIdiomaPreferido(String idiomaPreferido) { this.idiomaPreferido = idiomaPreferido; }
    public Integer getNivel() { return nivel; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }
    public Integer getPuntosExperiencia() { return puntosExperiencia; }
    public void setPuntosExperiencia(Integer puntosExperiencia) { this.puntosExperiencia = puntosExperiencia; }
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
}
