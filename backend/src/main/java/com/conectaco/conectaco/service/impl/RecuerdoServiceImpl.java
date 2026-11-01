package com.conectaco.conectaco.service.impl;

import com.conectaco.conectaco.dto.RecuerdoDTO;
import com.conectaco.conectaco.dto.RecuerdoRequest;
import com.conectaco.conectaco.entity.LugarEntity;
import com.conectaco.conectaco.entity.RecuerdoEntity;
import com.conectaco.conectaco.entity.TuristaEntity;
import com.conectaco.conectaco.entity.UsuarioEntity;
import com.conectaco.conectaco.exception.ApiException;
import com.conectaco.conectaco.mapper.RecuerdoMapper;
import com.conectaco.conectaco.repository.LugarRepository;
import com.conectaco.conectaco.repository.RecuerdoRepository;
import com.conectaco.conectaco.repository.TuristaRepository;
import com.conectaco.conectaco.repository.UsuarioRepository;
import com.conectaco.conectaco.service.LugarService;
import com.conectaco.conectaco.service.RecuerdoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecuerdoServiceImpl implements RecuerdoService {

    private final RecuerdoRepository recuerdoRepository;
    private final TuristaRepository turistaRepository;
    private final UsuarioRepository usuarioRepository;
    private final LugarRepository lugarRepository;
    private final LugarService lugarService;
    private final RecuerdoMapper recuerdoMapper;

    public RecuerdoServiceImpl(RecuerdoRepository recuerdoRepository, TuristaRepository turistaRepository,
                               UsuarioRepository usuarioRepository, LugarRepository lugarRepository,
                               LugarService lugarService, RecuerdoMapper recuerdoMapper) {
        this.recuerdoRepository = recuerdoRepository;
        this.turistaRepository = turistaRepository;
        this.usuarioRepository = usuarioRepository;
        this.lugarRepository = lugarRepository;
        this.lugarService = lugarService;
        this.recuerdoMapper = recuerdoMapper;
    }

    @Override
    public List<RecuerdoDTO> listar(Integer idTurista) {
        String autor = nombreDelTurista(idTurista);

        List<RecuerdoDTO> recuerdos = new ArrayList<>();
        for (RecuerdoEntity recuerdo : recuerdoRepository.findByIdTuristaOrderByFechaDescIdRecuerdoDesc(idTurista)) {
            LugarEntity lugar = lugarService.buscar(recuerdo.getIdLugar());
            recuerdos.add(recuerdoMapper.toRecuerdoDTO(recuerdo, lugar.getNombre(), autor));
        }
        return recuerdos;
    }

    @Override
    @Transactional
    public RecuerdoDTO crear(Integer idTurista, RecuerdoRequest request) {
        String autor = nombreDelTurista(idTurista);

        if (request.titulo() == null || request.titulo().isBlank()) {
            throw ApiException.peticionInvalida("Ponle un titulo a tu recuerdo");
        }
        if (request.idLugar() == null) {
            throw ApiException.peticionInvalida("Elige el lugar del recuerdo");
        }
        if (request.calificacion() != null && (request.calificacion() < 1 || request.calificacion() > 5)) {
            throw ApiException.peticionInvalida("La calificacion va de 1 a 5");
        }
        LugarEntity lugar = lugarService.buscar(request.idLugar());

        RecuerdoEntity recuerdo = recuerdoMapper.toRecuerdoEntity(request, idTurista);
        recuerdo = recuerdoRepository.save(recuerdo);

        actualizarCalificacion(lugar);
        return recuerdoMapper.toRecuerdoDTO(recuerdo, lugar.getNombre(), autor);
    }

    @Override
    @Transactional
    public void eliminar(Integer idTurista, Integer idRecuerdo) {
        RecuerdoEntity recuerdo = recuerdoRepository.findById(idRecuerdo).orElse(null);
        if (recuerdo == null || !recuerdo.getIdTurista().equals(idTurista)) {
            throw ApiException.noEncontrado("No existe ese recuerdo");
        }
        recuerdoRepository.delete(recuerdo);

        actualizarCalificacion(lugarService.buscar(recuerdo.getIdLugar()));
    }

    // La calificacion de un lugar es el promedio de las calificaciones de sus recuerdos
    private void actualizarCalificacion(LugarEntity lugar) {
        Double promedio = recuerdoRepository.promedioCalificacion(lugar.getIdLugar());
        if (promedio != null) {
            lugar.setCalificacionPromedio(Math.round(promedio * 10) / 10.0);
            lugarRepository.save(lugar);
        }
    }

    private String nombreDelTurista(Integer idTurista) {
        TuristaEntity turista = turistaRepository.findById(idTurista).orElse(null);
        if (turista == null) {
            throw ApiException.noEncontrado("No existe el turista " + idTurista);
        }
        UsuarioEntity usuario = usuarioRepository.findById(turista.getIdUsuario()).orElse(null);
        if (usuario == null) {
            throw ApiException.noEncontrado("No existe el usuario del turista " + idTurista);
        }
        return usuario.getNombre();
    }
}
