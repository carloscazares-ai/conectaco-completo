package com.conectaco.conectaco.entity;

import com.conectaco.conectaco.enums.EstadoVerificacion;
import jakarta.persistence.*;

@Entity
@Table(name = "Negocios")
public class NegocioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_negocio")
    private Integer idNegocio;
    private String rfc;
    private String telefono;
    private String horario;
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_verificacion", nullable = false)
    private EstadoVerificacion estadoVerificacion;
    @Column(name = "fk_id_usuario", nullable = false)
    private Integer idUsuario;

    public Integer getIdNegocio() { return idNegocio; }
    public void setIdNegocio(Integer idNegocio) { this.idNegocio = idNegocio; }
    public String getRfc() { return rfc; }
    public void setRfc(String rfc) { this.rfc = rfc; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public EstadoVerificacion getEstadoVerificacion() { return estadoVerificacion; }
    public void setEstadoVerificacion(EstadoVerificacion estadoVerificacion) { this.estadoVerificacion = estadoVerificacion; }
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
}
