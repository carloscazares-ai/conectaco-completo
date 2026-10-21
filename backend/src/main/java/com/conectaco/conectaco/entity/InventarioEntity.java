package com.conectaco.conectaco.entity;

import com.conectaco.conectaco.enums.EstadoInventario;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Inventario_turista")
public class InventarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario")
    private Integer idInventario;
    @Column(name = "fecha_canje", nullable = false)
    private LocalDate fechaCanje;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoInventario estado;
    @Column(name = "fk_id_turista", nullable = false)
    private Integer idTurista;
    @Column(name = "fk_id_recompensa", nullable = false)
    private Integer idRecompensa;

    public Integer getIdInventario() { return idInventario; }
    public void setIdInventario(Integer idInventario) { this.idInventario = idInventario; }
    public LocalDate getFechaCanje() { return fechaCanje; }
    public void setFechaCanje(LocalDate fechaCanje) { this.fechaCanje = fechaCanje; }
    public EstadoInventario getEstado() { return estado; }
    public void setEstado(EstadoInventario estado) { this.estado = estado; }
    public Integer getIdTurista() { return idTurista; }
    public void setIdTurista(Integer idTurista) { this.idTurista = idTurista; }
    public Integer getIdRecompensa() { return idRecompensa; }
    public void setIdRecompensa(Integer idRecompensa) { this.idRecompensa = idRecompensa; }
}
