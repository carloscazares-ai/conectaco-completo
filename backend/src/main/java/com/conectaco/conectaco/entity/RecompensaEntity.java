package com.conectaco.conectaco.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Recompensa")
public class RecompensaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recompensa")
    private Integer idRecompensa;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String tipo;
    @Column(nullable = false, length = 500)
    private String descripcion;
    @Column(name = "imagen_url")
    private String imagenUrl;
    @Column(name = "requisito_xp", nullable = false)
    private Integer requisitoXp;

    public Integer getIdRecompensa() { return idRecompensa; }
    public void setIdRecompensa(Integer idRecompensa) { this.idRecompensa = idRecompensa; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public Integer getRequisitoXp() { return requisitoXp; }
    public void setRequisitoXp(Integer requisitoXp) { this.requisitoXp = requisitoXp; }
}
