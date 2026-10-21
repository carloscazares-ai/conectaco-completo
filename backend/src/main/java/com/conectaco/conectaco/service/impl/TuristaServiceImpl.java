package com.conectaco.conectaco.service.impl;

import com.conectaco.conectaco.dto.*;
import com.conectaco.conectaco.entity.*;
import com.conectaco.conectaco.enums.EstadoInventario;
import com.conectaco.conectaco.enums.EstadoMision;
import com.conectaco.conectaco.exception.ApiException;
import com.conectaco.conectaco.mapper.MascotaMapper;
import com.conectaco.conectaco.mapper.MisionMapper;
import com.conectaco.conectaco.repository.*;
import com.conectaco.conectaco.service.LugarService;
import com.conectaco.conectaco.service.NegocioService;
import com.conectaco.conectaco.service.TuristaService;
import com.conectaco.conectaco.util.Niveles;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TuristaServiceImpl implements TuristaService {

    private static final int XP_CUIDAR_MASCOTA = 10;

    private final TuristaRepository turistaRepository;
    private final UsuarioRepository usuarioRepository;
    private final MascotaRepository mascotaRepository;
    private final MisionRepository misionRepository;
    private final ProgresoMisionRepository progresoMisionRepository;
    private final LugarRepository lugarRepository;
    private final FavoritoRepository favoritoRepository;
    private final VisitaRepository visitaRepository;
    private final RecuerdoRepository recuerdoRepository;
    private final RecompensaRepository recompensaRepository;
    private final InventarioRepository inventarioRepository;
    private final LugarService lugarService;
    private final NegocioService negocioService;
    private final MisionMapper misionMapper;
    private final MascotaMapper mascotaMapper;

    public TuristaServiceImpl(TuristaRepository turistaRepository, UsuarioRepository usuarioRepository,
                              MascotaRepository mascotaRepository, MisionRepository misionRepository,
                              ProgresoMisionRepository progresoMisionRepository, LugarRepository lugarRepository,
                              FavoritoRepository favoritoRepository, VisitaRepository visitaRepository,
                              RecuerdoRepository recuerdoRepository, RecompensaRepository recompensaRepository,
                              InventarioRepository inventarioRepository, LugarService lugarService,
                              NegocioService negocioService, MisionMapper misionMapper, MascotaMapper mascotaMapper) {
        this.turistaRepository = turistaRepository;
        this.usuarioRepository = usuarioRepository;
        this.mascotaRepository = mascotaRepository;
        this.misionRepository = misionRepository;
        this.progresoMisionRepository = progresoMisionRepository;
        this.lugarRepository = lugarRepository;
        this.favoritoRepository = favoritoRepository;
        this.visitaRepository = visitaRepository;
        this.recuerdoRepository = recuerdoRepository;
        this.recompensaRepository = recompensaRepository;
        this.inventarioRepository = inventarioRepository;
        this.lugarService = lugarService;
        this.negocioService = negocioService;
        this.misionMapper = misionMapper;
        this.mascotaMapper = mascotaMapper;
    }

    @Override
    public TuristaDashboardDTO dashboard(Integer idTurista) {
        TuristaEntity turista = buscarTurista(idTurista);
        String nombre = usuarioRepository.findById(turista.getIdUsuario()).map(UsuarioEntity::getNombre).orElse("");

        List<LugarDTO> recomendados = new ArrayList<>();
        for (LugarEntity lugar : lugarRepository.findAllByOrderByCalificacionPromedioDesc()) {
            if (recomendados.size() == 6) {
                break;
            }
            recomendados.add(lugarService.toDTO(lugar, idTurista));
        }

        return new TuristaDashboardDTO(nombre, turista.getPuntosExperiencia(), turista.getNivel(),
                visitaRepository.contarLugaresVisitados(idTurista), recuerdoRepository.countByIdTurista(idTurista),
                inventarioRepository.findByIdTurista(idTurista).size(), mascota(idTurista), recomendados,
                negocioService.promocionesVigentes());
    }

    @Override
    public List<MisionDTO> misiones(Integer idTurista, String filtro) {
        buscarTurista(idTurista);
        Map<Integer, ProgresoMisionEntity> progresos = new HashMap<>();
        for (ProgresoMisionEntity progreso : progresoMisionRepository.findByIdTurista(idTurista)) {
            progresos.put(progreso.getIdMision(), progreso);
        }

        String f = filtro == null ? "todas" : filtro.toLowerCase();
        List<MisionDTO> resultado = new ArrayList<>();
        for (MisionEntity mision : misionRepository.findByActivaTrue()) {
            ProgresoMisionEntity progreso = progresos.get(mision.getIdMision());
            boolean completada = progreso != null && progreso.getEstado() == EstadoMision.COMPLETADA;
            if ((f.equals("disponibles") && completada) || (f.equals("completadas") && !completada)) {
                continue;
            }
            String lugar = lugarRepository.findById(mision.getIdLugar()).map(LugarEntity::getNombre).orElse("");
            resultado.add(misionMapper.toMisionDTO(mision, lugar, progreso));
        }
        return resultado;
    }

    // Completar una mision suma sus XP al turista y a su mascota
    @Override
    @Transactional
    public MisionCompletadaDTO completarMision(Integer idTurista, Integer idMision) {
        TuristaEntity turista = buscarTurista(idTurista);
        MisionEntity mision = misionRepository.findById(idMision)
                .orElseThrow(() -> ApiException.noEncontrado("No existe la actividad " + idMision));
        if (!Boolean.TRUE.equals(mision.getActiva())) {
            throw ApiException.peticionInvalida("Esta actividad no esta disponible");
        }

        ProgresoMisionEntity progreso = progresoMisionRepository.findByIdTuristaAndIdMision(idTurista, idMision)
                .orElseGet(() -> {
                    ProgresoMisionEntity nuevo = new ProgresoMisionEntity();
                    nuevo.setIdTurista(idTurista);
                    nuevo.setIdMision(idMision);
                    nuevo.setFechaAsignacion(LocalDateTime.now());
                    return nuevo;
                });
        if (progreso.getEstado() == EstadoMision.COMPLETADA) {
            throw ApiException.conflicto("Ya completaste esta actividad");
        }
        progreso.setEstado(EstadoMision.COMPLETADA);
        progreso.setFechaCompletado(LocalDateTime.now());
        progreso = progresoMisionRepository.save(progreso);

        int nivelAnterior = turista.getNivel();
        int xp = turista.getPuntosExperiencia() + mision.getPuntosXp();
        turista.setPuntosExperiencia(xp);
        turista.setNivel(Niveles.nivel(xp));
        turistaRepository.save(turista);

        mascotaRepository.findByIdTurista(idTurista).ifPresent(m -> sumarXpMascota(m, mision.getPuntosXp()));

        String lugar = lugarRepository.findById(mision.getIdLugar()).map(LugarEntity::getNombre).orElse("");
        return new MisionCompletadaDTO(misionMapper.toMisionDTO(mision, lugar, progreso), mision.getPuntosXp(),
                xp, turista.getNivel(), turista.getNivel() > nivelAnterior);
    }

    @Override
    public List<LugarDTO> favoritos(Integer idTurista) {
        buscarTurista(idTurista);
        List<LugarDTO> lugares = new ArrayList<>();
        for (FavoritoEntity favorito : favoritoRepository.findByIdTurista(idTurista)) {
            lugarRepository.findById(favorito.getIdLugar())
                    .ifPresent(lugar -> lugares.add(lugarService.toDTO(lugar, idTurista)));
        }
        return lugares;
    }

    @Override
    @Transactional
    public LugarDTO alternarFavorito(Integer idTurista, Integer idLugar) {
        buscarTurista(idTurista);
        LugarEntity lugar = lugarService.buscar(idLugar);
        Optional<FavoritoEntity> existente = favoritoRepository.findByIdTuristaAndIdLugar(idTurista, idLugar);
        if (existente.isPresent()) {
            favoritoRepository.delete(existente.get());
        } else {
            FavoritoEntity favorito = new FavoritoEntity();
            favorito.setIdTurista(idTurista);
            favorito.setIdLugar(idLugar);
            favorito.setFecha(LocalDateTime.now());
            favoritoRepository.save(favorito);
        }
        return lugarService.toDTO(lugar, idTurista);
    }

    @Override
    public MascotaDTO mascota(Integer idTurista) {
        MascotaEntity mascota = buscarMascota(idTurista);
        String accesorio = mascota.getIdRecompensaEquipada() == null ? null
                : recompensaRepository.findById(mascota.getIdRecompensaEquipada())
                .map(RecompensaEntity::getNombre).orElse(null);
        return mascotaMapper.toMascotaDTO(mascota, accesorio);
    }

    @Override
    @Transactional
    public MascotaDTO actualizarMascota(Integer idTurista, MascotaRequest request) {
        MascotaEntity mascota = buscarMascota(idTurista);
        if (request.nombre() != null && !request.nombre().isBlank()) {
            mascota.setNombre(request.nombre().trim());
        }
        Integer idRecompensa = request.idRecompensaEquipada();
        if (idRecompensa != null && idRecompensa == 0) {
            mascota.setIdRecompensaEquipada(null);
        } else if (idRecompensa != null) {
            if (!inventarioRepository.existsByIdTuristaAndIdRecompensa(idTurista, idRecompensa)) {
                throw ApiException.peticionInvalida("Primero canjea esa recompensa");
            }
            mascota.setIdRecompensaEquipada(idRecompensa);
        }
        mascotaRepository.save(mascota);
        return mascota(idTurista);
    }

    @Override
    @Transactional
    public MascotaDTO cuidarMascota(Integer idTurista, String accion) {
        if (!"alimentar".equalsIgnoreCase(accion) && !"jugar".equalsIgnoreCase(accion)) {
            throw ApiException.peticionInvalida("La accion debe ser alimentar o jugar");
        }
        sumarXpMascota(buscarMascota(idTurista), XP_CUIDAR_MASCOTA);
        return mascota(idTurista);
    }

    @Override
    public List<RecompensaDTO> recompensas(Integer idTurista) {
        TuristaEntity turista = buscarTurista(idTurista);
        Integer equipada = buscarMascota(idTurista).getIdRecompensaEquipada();
        Set<Integer> canjeadas = new HashSet<>();
        for (InventarioEntity item : inventarioRepository.findByIdTurista(idTurista)) {
            canjeadas.add(item.getIdRecompensa());
        }

        List<RecompensaDTO> resultado = new ArrayList<>();
        for (RecompensaEntity recompensa : recompensaRepository.findAllByOrderByRequisitoXpAsc()) {
            resultado.add(toRecompensaDTO(recompensa, turista, canjeadas.contains(recompensa.getIdRecompensa()),
                    recompensa.getIdRecompensa().equals(equipada)));
        }
        return resultado;
    }

    @Override
    @Transactional
    public RecompensaDTO canjearRecompensa(Integer idTurista, Integer idRecompensa) {
        TuristaEntity turista = buscarTurista(idTurista);
        RecompensaEntity recompensa = recompensaRepository.findById(idRecompensa)
                .orElseThrow(() -> ApiException.noEncontrado("No existe la recompensa " + idRecompensa));
        if (turista.getPuntosExperiencia() < recompensa.getRequisitoXp()) {
            throw ApiException.peticionInvalida("Te faltan "
                    + (recompensa.getRequisitoXp() - turista.getPuntosExperiencia()) + " XP para esta recompensa");
        }
        if (inventarioRepository.existsByIdTuristaAndIdRecompensa(idTurista, idRecompensa)) {
            throw ApiException.conflicto("Ya tienes esta recompensa");
        }
        InventarioEntity item = new InventarioEntity();
        item.setIdTurista(idTurista);
        item.setIdRecompensa(idRecompensa);
        item.setFechaCanje(LocalDate.now());
        item.setEstado(EstadoInventario.DISPONIBLE);
        inventarioRepository.save(item);
        return toRecompensaDTO(recompensa, turista, true, false);
    }

    private RecompensaDTO toRecompensaDTO(RecompensaEntity r, TuristaEntity turista, boolean canjeada, boolean equipada) {
        return new RecompensaDTO(r.getIdRecompensa(), r.getNombre(), r.getTipo(), r.getDescripcion(),
                r.getImagenUrl(), r.getRequisitoXp(), turista.getPuntosExperiencia() >= r.getRequisitoXp(),
                canjeada, equipada);
    }

    private void sumarXpMascota(MascotaEntity mascota, int xp) {
        mascota.setExperiencia(mascota.getExperiencia() + xp);
        mascota.setNivel(Niveles.nivel(mascota.getExperiencia()));
        mascotaRepository.save(mascota);
    }

    private TuristaEntity buscarTurista(Integer idTurista) {
        return turistaRepository.findById(idTurista)
                .orElseThrow(() -> ApiException.noEncontrado("No existe el turista " + idTurista));
    }

    private MascotaEntity buscarMascota(Integer idTurista) {
        return mascotaRepository.findByIdTurista(idTurista)
                .orElseThrow(() -> ApiException.noEncontrado("El turista " + idTurista + " no tiene mascota"));
    }
}
