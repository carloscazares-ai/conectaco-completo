package com.conectaco.conectaco.service;

import com.conectaco.conectaco.dto.*;

import java.util.List;

public interface NegocioService {
    NegocioDashboardDTO dashboard(Integer idNegocio);

    LugarDTO lugar(Integer idNegocio);

    LugarDTO guardarLugar(Integer idNegocio, LugarRequest request);

    List<MisionDTO> misiones(Integer idNegocio);

    MisionDTO crearMision(Integer idNegocio, MisionRequest request);

    MisionDTO actualizarMision(Integer idNegocio, Integer idMision, MisionRequest request);

    void eliminarMision(Integer idNegocio, Integer idMision);

    List<PromocionDTO> promociones(Integer idNegocio);

    PromocionDTO crearPromocion(Integer idNegocio, PromocionRequest request);

    PromocionDTO actualizarPromocion(Integer idNegocio, Integer idPromocion, PromocionRequest request);

    void eliminarPromocion(Integer idNegocio, Integer idPromocion);

    List<PromocionDTO> promocionesVigentes();

    EstadisticasDTO estadisticas(Integer idNegocio, int dias);

    NegocioPerfilDTO perfil(Integer idNegocio);

    NegocioPerfilDTO actualizarPerfil(Integer idNegocio, NegocioPerfilRequest request);
}
