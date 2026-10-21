package com.conectaco.conectaco.entity;

import com.conectaco.conectaco.enums.EstadoMision;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Progreso_mision")
public class ProgresoMisionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_progreso_mision")
    private Integer idProgresoMision;
    @Column(name = "fk_id_mision", nullable = false)
    private Integer idMision;
    @Column(name = "fk_id_turista", nullable = false)
    private Integer idTurista;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMision estado;
    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDateTime fechaAsignacion;
    @Column(name = "fecha_completado")
    private LocalDateTime fechaCompletado;

    public Integer getIdProgresoMision() { return idProgresoMision; }
    public void setIdProgresoMision(Integer idProgresoMision) { this.idProgresoMision = idProgresoMision; }
    public Integer getIdMision() { return idMision; }
    public void setIdMision(Integer idMision) { this.idMision = idMision; }
    public Integer getIdTurista() { return idTurista; }
    public void setIdTurista(Integer idTurista) { this.idTurista = idTurista; }
    public EstadoMision getEstado() { return estado; }
    public void setEstado(EstadoMision estado) { this.estado = estado; }
    public LocalDateTime getFechaAsignacion() { return fechaAsignacion; }
    public void setFechaAsignacion(LocalDateTime fechaAsignacion) { this.fechaAsignacion = fechaAsignacion; }
    public LocalDateTime getFechaCompletado() { return fechaCompletado; }
    public void setFechaCompletado(LocalDateTime fechaCompletado) { this.fechaCompletado = fechaCompletado; }
}
