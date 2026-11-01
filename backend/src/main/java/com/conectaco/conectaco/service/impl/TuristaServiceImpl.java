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
import java.util.ArrayList;
import java.util.List;

@Service
public class TuristaServiceImpl implements TuristaService {

    private static final int XP_CUIDAR_MASCOTA = 10;
    private static final int LUGARES_RECOMENDADOS = 6;

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

        String nombre = "";
        UsuarioEntity usuario = usuarioRepository.findById(turista.getIdUsuario()).orElse(null);
        if (usuario != null) {
            nombre = usuario.getNombre();
        }

        // Los lugares mejor calificados
        List<LugarDTO> recomendados = new ArrayList<>();
        for (LugarEntity lugar : lugarRepository.findAllByOrderByCalificacionPromedioDesc()) {
            if (recomendados.size() == LUGARES_RECOMENDADOS) {
                break;
            }
            recomendados.add(lugarService.toDTO(lugar, idTurista));
        }

        return new TuristaDashboardDTO(nombre, turista.getPuntosExperiencia(), turista.getNivel(),
                visitaRepository.contarLugaresVisitados(idTurista), recuerdoRepository.countByIdTurista(idTurista),
                inventarioRepository.findByIdTurista(idTurista).size(), mascota(idTurista), recomendados,
                negocioService.promocionesVigentes());
    }

    // filtro: "todas", "disponibles" o "completadas"
    @Override
    public List<MisionDTO> misiones(Integer idTurista, String filtro) {
        buscarTurista(idTurista);

        List<MisionDTO> resultado = new ArrayList<>();
        for (MisionEntity mision : misionRepository.findByActivaTrue()) {
            ProgresoMisionEntity progreso = progresoMisionRepository
                    .findByIdTuristaAndIdMision(idTurista, mision.getIdMision()).orElse(null);
            boolean completada = progreso != null && progreso.getEstado() == EstadoMision.COMPLETADA;

            if ("disponibles".equals(filtro) && completada) {
                continue;
            }
            if ("completadas".equals(filtro) && !completada) {
                continue;
            }
            resultado.add(misionMapper.toMisionDTO(mision, nombreDelLugar(mision.getIdLugar()), progreso));
        }
        return resultado;
    }

    // Completar una actividad le suma sus XP al turista y a su mascota
    @Override
    @Transactional
    public MisionCompletadaDTO completarMision(Integer idTurista, Integer idMision) {
        TuristaEntity turista = buscarTurista(idTurista);

        MisionEntity mision = misionRepository.findById(idMision).orElse(null);
        if (mision == null) {
            throw ApiException.noEncontrado("No existe la actividad " + idMision);
        }
        if (!mision.getActiva()) {
            throw ApiException.peticionInvalida("Esta actividad no esta disponible");
        }

        // Si el turista nunca la habia empezado, se crea su progreso
        ProgresoMisionEntity progreso = progresoMisionRepository.findByIdTuristaAndIdMision(idTurista, idMision).orElse(null);
        if (progreso == null) {
            progreso = new ProgresoMisionEntity();
            progreso.setIdTurista(idTurista);
            progreso.setIdMision(idMision);
            progreso.setFechaAsignacion(LocalDateTime.now());
        }
        if (progreso.getEstado() == EstadoMision.COMPLETADA) {
            throw ApiException.conflicto("Ya completaste esta actividad");
        }
        progreso.setEstado(EstadoMision.COMPLETADA);
        progreso.setFechaCompletado(LocalDateTime.now());
        progreso = progresoMisionRepository.save(progreso);

        // Sumarle los puntos al turista
        int nivelAnterior = turista.getNivel();
        int xp = turista.getPuntosExperiencia() + mision.getPuntosXp();
        turista.setPuntosExperiencia(xp);
        turista.setNivel(Niveles.nivel(xp));
        turistaRepository.save(turista);

        // Y a su mascota
        sumarXpMascota(buscarMascota(idTurista), mision.getPuntosXp());

        boolean subioNivel = turista.getNivel() > nivelAnterior;
        MisionDTO misionDTO = misionMapper.toMisionDTO(mision, nombreDelLugar(mision.getIdLugar()), progreso);
        return new MisionCompletadaDTO(misionDTO, mision.getPuntosXp(), xp, turista.getNivel(), subioNivel);
    }

    @Override
    public List<LugarDTO> favoritos(Integer idTurista) {
        buscarTurista(idTurista);

        List<LugarDTO> lugares = new ArrayList<>();
        for (FavoritoEntity favorito : favoritoRepository.findByIdTurista(idTurista)) {
            LugarEntity lugar = lugarService.buscar(favorito.getIdLugar());
            lugares.add(lugarService.toDTO(lugar, idTurista));
        }
        return lugares;
    }

    // Si ya estaba guardado lo quita; si no, lo guarda
    @Override
    @Transactional
    public LugarDTO alternarFavorito(Integer idTurista, Integer idLugar) {
        buscarTurista(idTurista);
        LugarEntity lugar = lugarService.buscar(idLugar);

        FavoritoEntity favorito = favoritoRepository.findByIdTuristaAndIdLugar(idTurista, idLugar).orElse(null);
        if (favorito != null) {
            favoritoRepository.delete(favorito);
        } else {
            favorito = new FavoritoEntity();
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

        // Nombre del accesorio que trae puesto (si trae uno)
        String accesorio = null;
        if (mascota.getIdRecompensaEquipada() != null) {
            RecompensaEntity recompensa = recompensaRepository.findById(mascota.getIdRecompensaEquipada()).orElse(null);
            if (recompensa != null) {
                accesorio = recompensa.getNombre();
            }
        }
        return mascotaMapper.toMascotaDTO(mascota, accesorio);
    }

    // Sirve para cambiarle el nombre y para ponerle o quitarle un accesorio (0 = quitar)
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

    // accion: "alimentar" o "jugar"
    @Override
    @Transactional
    public MascotaDTO cuidarMascota(Integer idTurista, String accion) {
        if (!"alimentar".equals(accion) && !"jugar".equals(accion)) {
            throw ApiException.peticionInvalida("La accion debe ser alimentar o jugar");
        }
        sumarXpMascota(buscarMascota(idTurista), XP_CUIDAR_MASCOTA);
        return mascota(idTurista);
    }

    @Override
    public List<RecompensaDTO> recompensas(Integer idTurista) {
        TuristaEntity turista = buscarTurista(idTurista);
        MascotaEntity mascota = buscarMascota(idTurista);

        List<RecompensaDTO> resultado = new ArrayList<>();
        for (RecompensaEntity recompensa : recompensaRepository.findAllByOrderByRequisitoXpAsc()) {
            boolean canjeada = inventarioRepository.existsByIdTuristaAndIdRecompensa(idTurista, recompensa.getIdRecompensa());
            boolean equipada = recompensa.getIdRecompensa().equals(mascota.getIdRecompensaEquipada());
            resultado.add(toRecompensaDTO(recompensa, turista, canjeada, equipada));
        }
        return resultado;
    }

    @Override
    @Transactional
    public RecompensaDTO canjearRecompensa(Integer idTurista, Integer idRecompensa) {
        TuristaEntity turista = buscarTurista(idTurista);

        RecompensaEntity recompensa = recompensaRepository.findById(idRecompensa).orElse(null);
        if (recompensa == null) {
            throw ApiException.noEncontrado("No existe la recompensa " + idRecompensa);
        }
        if (turista.getPuntosExperiencia() < recompensa.getRequisitoXp()) {
            int faltan = recompensa.getRequisitoXp() - turista.getPuntosExperiencia();
            throw ApiException.peticionInvalida("Te faltan " + faltan + " XP para esta recompensa");
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

    private RecompensaDTO toRecompensaDTO(RecompensaEntity recompensa, TuristaEntity turista,
                                          boolean canjeada, boolean equipada) {
        boolean desbloqueada = turista.getPuntosExperiencia() >= recompensa.getRequisitoXp();
        return new RecompensaDTO(recompensa.getIdRecompensa(), recompensa.getNombre(), recompensa.getTipo(),
                recompensa.getDescripcion(), recompensa.getImagenUrl(), recompensa.getRequisitoXp(),
                desbloqueada, canjeada, equipada);
    }

    private void sumarXpMascota(MascotaEntity mascota, int xp) {
        mascota.setExperiencia(mascota.getExperiencia() + xp);
        mascota.setNivel(Niveles.nivel(mascota.getExperiencia()));
        mascotaRepository.save(mascota);
    }

    private String nombreDelLugar(Integer idLugar) {
        return lugarService.buscar(idLugar).getNombre();
    }

    private TuristaEntity buscarTurista(Integer idTurista) {
        TuristaEntity turista = turistaRepository.findById(idTurista).orElse(null);
        if (turista == null) {
            throw ApiException.noEncontrado("No existe el turista " + idTurista);
        }
        return turista;
    }

    private MascotaEntity buscarMascota(Integer idTurista) {
        MascotaEntity mascota = mascotaRepository.findByIdTurista(idTurista).orElse(null);
        if (mascota == null) {
            throw ApiException.noEncontrado("El turista " + idTurista + " no tiene mascota");
        }
        return mascota;
    }
}
