package com.conectaco.conectaco.service.impl;

import com.conectaco.conectaco.dto.CategoriaDTO;
import com.conectaco.conectaco.dto.LugarDTO;
import com.conectaco.conectaco.dto.MisionDTO;
import com.conectaco.conectaco.dto.RecuerdoDTO;
import com.conectaco.conectaco.entity.CategoriaEntity;
import com.conectaco.conectaco.entity.LugarEntity;
import com.conectaco.conectaco.entity.MisionEntity;
import com.conectaco.conectaco.entity.ProgresoMisionEntity;
import com.conectaco.conectaco.entity.RecuerdoEntity;
import com.conectaco.conectaco.entity.VisitaEntity;
import com.conectaco.conectaco.exception.ApiException;
import com.conectaco.conectaco.mapper.LugarMapper;
import com.conectaco.conectaco.mapper.MisionMapper;
import com.conectaco.conectaco.mapper.RecuerdoMapper;
import com.conectaco.conectaco.repository.*;
import com.conectaco.conectaco.service.LugarService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LugarServiceImpl implements LugarService {

    private final LugarRepository lugarRepository;
    private final CategoriaRepository categoriaRepository;
    private final MisionRepository misionRepository;
    private final RecuerdoRepository recuerdoRepository;
    private final FavoritoRepository favoritoRepository;
    private final VisitaRepository visitaRepository;
    private final ProgresoMisionRepository progresoMisionRepository;
    private final TuristaRepository turistaRepository;
    private final UsuarioRepository usuarioRepository;
    private final LugarMapper lugarMapper;
    private final MisionMapper misionMapper;
    private final RecuerdoMapper recuerdoMapper;

    public LugarServiceImpl(LugarRepository lugarRepository, CategoriaRepository categoriaRepository,
                            MisionRepository misionRepository, RecuerdoRepository recuerdoRepository,
                            FavoritoRepository favoritoRepository, VisitaRepository visitaRepository,
                            ProgresoMisionRepository progresoMisionRepository, TuristaRepository turistaRepository,
                            UsuarioRepository usuarioRepository, LugarMapper lugarMapper,
                            MisionMapper misionMapper, RecuerdoMapper recuerdoMapper) {
        this.lugarRepository = lugarRepository;
        this.categoriaRepository = categoriaRepository;
        this.misionRepository = misionRepository;
        this.recuerdoRepository = recuerdoRepository;
        this.favoritoRepository = favoritoRepository;
        this.visitaRepository = visitaRepository;
        this.progresoMisionRepository = progresoMisionRepository;
        this.turistaRepository = turistaRepository;
        this.usuarioRepository = usuarioRepository;
        this.lugarMapper = lugarMapper;
        this.misionMapper = misionMapper;
        this.recuerdoMapper = recuerdoMapper;
    }

    @Override
    public List<CategoriaDTO> categorias() {
        List<CategoriaDTO> categorias = new ArrayList<>();
        for (CategoriaEntity categoria : categoriaRepository.findAll()) {
            categorias.add(new CategoriaDTO(categoria.getIdCategoria(), categoria.getNombreCategoria()));
        }
        return categorias;
    }

    @Override
    public List<LugarDTO> listar(Integer idCategoria, String busqueda, Integer idTurista) {
        List<LugarEntity> lugares = idCategoria == null
                ? lugarRepository.findAllByOrderByCalificacionPromedioDesc()
                : lugarRepository.findByIdCategoriaOrderByCalificacionPromedioDesc(idCategoria);

        String texto = busqueda == null ? "" : normalizar(busqueda);
        List<LugarDTO> resultado = new ArrayList<>();
        for (LugarEntity lugar : lugares) {
            if (texto.isEmpty()
                    || normalizar(lugar.getNombre()).contains(texto)
                    || normalizar(lugar.getDireccion()).contains(texto)
                    || normalizar(lugar.getDescripcion()).contains(texto)) {
                resultado.add(toDTO(lugar, idTurista));
            }
        }
        return resultado;
    }

    // Ver el detalle cuenta como una visita al perfil del lugar (sirve para las estadisticas del negocio)
    @Override
    @Transactional
    public LugarDTO detalle(Integer idLugar, Integer idTurista) {
        LugarEntity lugar = buscar(idLugar);
        if (idTurista != null && turistaRepository.existsById(idTurista)) {
            VisitaEntity visita = new VisitaEntity();
            visita.setIdLugar(idLugar);
            visita.setIdTurista(idTurista);
            visita.setFecha(LocalDateTime.now());
            visitaRepository.save(visita);
        }
        return toDTO(lugar, idTurista);
    }

    @Override
    public List<MisionDTO> misiones(Integer idLugar, Integer idTurista) {
        LugarEntity lugar = buscar(idLugar);
        List<MisionDTO> misiones = new ArrayList<>();
        for (MisionEntity mision : misionRepository.findByIdLugarAndActivaTrue(idLugar)) {
            ProgresoMisionEntity progreso = idTurista == null ? null
                    : progresoMisionRepository.findByIdTuristaAndIdMision(idTurista, mision.getIdMision()).orElse(null);
            misiones.add(misionMapper.toMisionDTO(mision, lugar.getNombre(), progreso));
        }
        return misiones;
    }

    @Override
    public List<RecuerdoDTO> opiniones(Integer idLugar) {
        LugarEntity lugar = buscar(idLugar);
        List<RecuerdoDTO> opiniones = new ArrayList<>();
        for (RecuerdoEntity recuerdo : recuerdoRepository.findByIdLugarOrderByFechaDescIdRecuerdoDesc(idLugar)) {
            String autor = turistaRepository.findById(recuerdo.getIdTurista())
                    .flatMap(t -> usuarioRepository.findById(t.getIdUsuario()))
                    .map(u -> u.getNombre()).orElse("Turista");
            opiniones.add(recuerdoMapper.toRecuerdoDTO(recuerdo, lugar.getNombre(), autor));
        }
        return opiniones;
    }

    @Override
    public LugarDTO toDTO(LugarEntity lugar, Integer idTurista) {
        String categoria = categoriaRepository.findById(lugar.getIdCategoria())
                .map(CategoriaEntity::getNombreCategoria).orElse("");
        long opiniones = recuerdoRepository.findByIdLugarOrderByFechaDescIdRecuerdoDesc(lugar.getIdLugar()).size();
        long actividades = misionRepository.countByIdLugarAndActivaTrue(lugar.getIdLugar());
        boolean favorito = idTurista != null
                && favoritoRepository.findByIdTuristaAndIdLugar(idTurista, lugar.getIdLugar()).isPresent();
        return lugarMapper.toLugarDTO(lugar, categoria, opiniones, actividades, favorito);
    }

    @Override
    public LugarEntity buscar(Integer idLugar) {
        return lugarRepository.findById(idLugar)
                .orElseThrow(() -> ApiException.noEncontrado("No existe el lugar " + idLugar));
    }

    // Para buscar sin importar mayusculas ni acentos ("cafe" encuentra "Café")
    private static String normalizar(String texto) {
        String sinAcentos = Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return sinAcentos.toLowerCase().trim();
    }
}
