package com.conectaco.conectaco.service.impl;

import com.conectaco.conectaco.dto.*;
import com.conectaco.conectaco.entity.*;
import com.conectaco.conectaco.enums.EstadoMision;
import com.conectaco.conectaco.exception.ApiException;
import com.conectaco.conectaco.mapper.LugarMapper;
import com.conectaco.conectaco.mapper.MisionMapper;
import com.conectaco.conectaco.mapper.PromocionMapper;
import com.conectaco.conectaco.repository.*;
import com.conectaco.conectaco.service.LugarService;
import com.conectaco.conectaco.service.NegocioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class NegocioServiceImpl implements NegocioService {

    // Centro de la CDMX, por si el negocio no pone coordenadas
    private static final double LATITUD_CDMX = 19.4326;
    private static final double LONGITUD_CDMX = -99.1332;

    private final NegocioRepository negocioRepository;
    private final UsuarioRepository usuarioRepository;
    private final LugarRepository lugarRepository;
    private final CategoriaRepository categoriaRepository;
    private final MisionRepository misionRepository;
    private final ProgresoMisionRepository progresoMisionRepository;
    private final PromocionRepository promocionRepository;
    private final VisitaRepository visitaRepository;
    private final FavoritoRepository favoritoRepository;
    private final LugarService lugarService;
    private final LugarMapper lugarMapper;
    private final MisionMapper misionMapper;
    private final PromocionMapper promocionMapper;

    public NegocioServiceImpl(NegocioRepository negocioRepository, UsuarioRepository usuarioRepository,
                              LugarRepository lugarRepository, CategoriaRepository categoriaRepository,
                              MisionRepository misionRepository, ProgresoMisionRepository progresoMisionRepository,
                              PromocionRepository promocionRepository, VisitaRepository visitaRepository,
                              FavoritoRepository favoritoRepository, LugarService lugarService,
                              LugarMapper lugarMapper, MisionMapper misionMapper, PromocionMapper promocionMapper) {
        this.negocioRepository = negocioRepository;
        this.usuarioRepository = usuarioRepository;
        this.lugarRepository = lugarRepository;
        this.categoriaRepository = categoriaRepository;
        this.misionRepository = misionRepository;
        this.progresoMisionRepository = progresoMisionRepository;
        this.promocionRepository = promocionRepository;
        this.visitaRepository = visitaRepository;
        this.favoritoRepository = favoritoRepository;
        this.lugarService = lugarService;
        this.lugarMapper = lugarMapper;
        this.misionMapper = misionMapper;
        this.promocionMapper = promocionMapper;
    }

    @Override
    public NegocioDashboardDTO dashboard(Integer idNegocio) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        String nombre = nombreDe(negocio);
        Optional<LugarEntity> lugar = lugarRepository.findFirstByIdNegocio(idNegocio);
        if (lugar.isEmpty()) {
            return new NegocioDashboardDTO(nombre, null, 0, 0, 0, serieVisitas(null, 30));
        }
        Integer idLugar = lugar.get().getIdLugar();
        return new NegocioDashboardDTO(nombre, lugarService.toDTO(lugar.get(), null),
                visitaRepository.countByIdLugar(idLugar), misionRepository.findByIdLugar(idLugar).size(),
                favoritoRepository.countByIdLugar(idLugar), serieVisitas(idLugar, 30));
    }

    @Override
    public LugarDTO lugar(Integer idNegocio) {
        buscarNegocio(idNegocio);
        return lugarRepository.findFirstByIdNegocio(idNegocio)
                .map(l -> lugarService.toDTO(l, null))
                .orElse(null);
    }

    // Crea el establecimiento la primera vez y despues lo actualiza
    @Override
    @Transactional
    public LugarDTO guardarLugar(Integer idNegocio, LugarRequest request) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw ApiException.peticionInvalida("El nombre del establecimiento es obligatorio");
        }
        if (request.direccion() == null || request.direccion().isBlank()) {
            throw ApiException.peticionInvalida("La direccion es obligatoria");
        }
        if (request.idCategoria() == null || !categoriaRepository.existsById(request.idCategoria())) {
            throw ApiException.peticionInvalida("Elige una categoria valida");
        }

        LugarEntity lugar = lugarRepository.findFirstByIdNegocio(idNegocio).orElseGet(() -> {
            LugarEntity nuevo = new LugarEntity();
            nuevo.setIdNegocio(negocio.getIdNegocio());
            nuevo.setCalificacionPromedio(0.0);
            return nuevo;
        });
        lugarMapper.copiar(request, lugar);
        if (lugar.getDescripcion() == null) lugar.setDescripcion("");
        if (lugar.getHorario() == null || lugar.getHorario().isBlank()) lugar.setHorario("Por definir");
        if (lugar.getCosto() == null || lugar.getCosto().isBlank()) lugar.setCosto("$$");
        if (lugar.getLatitud() == null) lugar.setLatitud(LATITUD_CDMX);
        if (lugar.getLongitud() == null) lugar.setLongitud(LONGITUD_CDMX);
        lugar = lugarRepository.save(lugar);
        return lugarService.toDTO(lugar, null);
    }

    @Override
    public List<MisionDTO> misiones(Integer idNegocio) {
        buscarNegocio(idNegocio);
        Optional<LugarEntity> lugar = lugarRepository.findFirstByIdNegocio(idNegocio);
        List<MisionDTO> misiones = new ArrayList<>();
        if (lugar.isPresent()) {
            for (MisionEntity mision : misionRepository.findByIdLugar(lugar.get().getIdLugar())) {
                misiones.add(misionMapper.toMisionDTO(mision, lugar.get().getNombre(), null));
            }
        }
        return misiones;
    }

    @Override
    @Transactional
    public MisionDTO crearMision(Integer idNegocio, MisionRequest request) {
        buscarNegocio(idNegocio);
        LugarEntity lugar = lugarRepository.findFirstByIdNegocio(idNegocio)
                .orElseThrow(() -> ApiException.peticionInvalida("Primero registra tu establecimiento en \"Mi establecimiento\""));
        MisionEntity mision = new MisionEntity();
        mision.setIdLugar(lugar.getIdLugar());
        copiarMision(request, mision);
        mision = misionRepository.save(mision);
        return misionMapper.toMisionDTO(mision, lugar.getNombre(), null);
    }

    @Override
    @Transactional
    public MisionDTO actualizarMision(Integer idNegocio, Integer idMision, MisionRequest request) {
        MisionEntity mision = buscarMisionDelNegocio(idNegocio, idMision);
        copiarMision(request, mision);
        mision = misionRepository.save(mision);
        String lugar = lugarRepository.findById(mision.getIdLugar()).map(LugarEntity::getNombre).orElse("");
        return misionMapper.toMisionDTO(mision, lugar, null);
    }

    @Override
    @Transactional
    public void eliminarMision(Integer idNegocio, Integer idMision) {
        misionRepository.delete(buscarMisionDelNegocio(idNegocio, idMision));
    }

    @Override
    public List<PromocionDTO> promociones(Integer idNegocio) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        List<PromocionDTO> promociones = new ArrayList<>();
        for (PromocionEntity promocion : promocionRepository.findByIdNegocioOrderByFechaFinAsc(idNegocio)) {
            promociones.add(toPromocionDTO(promocion, negocio));
        }
        return promociones;
    }

    @Override
    @Transactional
    public PromocionDTO crearPromocion(Integer idNegocio, PromocionRequest request) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        validarPromocion(request);
        PromocionEntity promocion = new PromocionEntity();
        promocion.setIdNegocio(idNegocio);
        promocionMapper.copiar(request, promocion);
        return toPromocionDTO(promocionRepository.save(promocion), negocio);
    }

    @Override
    @Transactional
    public PromocionDTO actualizarPromocion(Integer idNegocio, Integer idPromocion, PromocionRequest request) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        validarPromocion(request);
        PromocionEntity promocion = buscarPromocionDelNegocio(idNegocio, idPromocion);
        promocionMapper.copiar(request, promocion);
        return toPromocionDTO(promocionRepository.save(promocion), negocio);
    }

    @Override
    @Transactional
    public void eliminarPromocion(Integer idNegocio, Integer idPromocion) {
        promocionRepository.delete(buscarPromocionDelNegocio(idNegocio, idPromocion));
    }

    @Override
    public List<PromocionDTO> promocionesVigentes() {
        List<PromocionDTO> promociones = new ArrayList<>();
        for (PromocionEntity promocion : promocionRepository
                .findByActivaTrueAndFechaFinGreaterThanEqualOrderByFechaFinAsc(LocalDate.now())) {
            negocioRepository.findById(promocion.getIdNegocio())
                    .ifPresent(negocio -> promociones.add(toPromocionDTO(promocion, negocio)));
        }
        return promociones;
    }

    @Override
    public EstadisticasDTO estadisticas(Integer idNegocio, int dias) {
        buscarNegocio(idNegocio);
        if (dias < 1 || dias > 365) {
            throw ApiException.peticionInvalida("Los dias deben ir de 1 a 365");
        }
        Optional<LugarEntity> lugar = lugarRepository.findFirstByIdNegocio(idNegocio);
        if (lugar.isEmpty()) {
            return new EstadisticasDTO(dias, 0, null, 0, null, 0, null, serieVisitas(null, dias));
        }
        Integer idLugar = lugar.get().getIdLugar();
        LocalDateTime hasta = LocalDate.now().plusDays(1).atStartOfDay();
        LocalDateTime desde = hasta.minusDays(dias);
        LocalDateTime antes = desde.minusDays(dias);

        long visitas = visitaRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, desde, hasta);
        long visitasAntes = visitaRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, antes, desde);
        long completadas = progresoMisionRepository.contarCompletadasEnLugar(idLugar, EstadoMision.COMPLETADA, desde, hasta);
        long completadasAntes = progresoMisionRepository.contarCompletadasEnLugar(idLugar, EstadoMision.COMPLETADA, antes, desde);
        long seguidores = favoritoRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, desde, hasta);
        long seguidoresAntes = favoritoRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, antes, desde);

        return new EstadisticasDTO(dias, visitas, cambio(visitas, visitasAntes), completadas,
                cambio(completadas, completadasAntes), seguidores, cambio(seguidores, seguidoresAntes),
                serieVisitas(idLugar, dias));
    }

    @Override
    public NegocioPerfilDTO perfil(Integer idNegocio) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        UsuarioEntity usuario = usuarioRepository.findById(negocio.getIdUsuario()).orElseThrow();
        Optional<LugarEntity> lugar = lugarRepository.findFirstByIdNegocio(idNegocio);
        String categoria = lugar.flatMap(l -> categoriaRepository.findById(l.getIdCategoria()))
                .map(CategoriaEntity::getNombreCategoria).orElse(null);
        return new NegocioPerfilDTO(idNegocio, usuario.getNombre(), usuario.getEmail(), negocio.getRfc(),
                negocio.getTelefono(), negocio.getHorario(), negocio.getEstadoVerificacion(), categoria,
                lugar.map(LugarEntity::getDireccion).orElse(null), lugar.map(LugarEntity::getImagenUrl).orElse(null));
    }

    @Override
    @Transactional
    public NegocioPerfilDTO actualizarPerfil(Integer idNegocio, NegocioPerfilRequest request) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        if (request.nombre() != null && !request.nombre().isBlank()) {
            UsuarioEntity usuario = usuarioRepository.findById(negocio.getIdUsuario()).orElseThrow();
            usuario.setNombre(request.nombre().trim());
            usuarioRepository.save(usuario);
        }
        negocio.setRfc(request.rfc());
        negocio.setTelefono(request.telefono());
        negocio.setHorario(request.horario());
        negocioRepository.save(negocio);
        return perfil(idNegocio);
    }

    // Una cuenta de visitas por dia, incluyendo los dias en cero, para dibujar la grafica
    private List<PuntoSerieDTO> serieVisitas(Integer idLugar, int dias) {
        LocalDate hoy = LocalDate.now();
        LocalDate inicio = hoy.minusDays(dias - 1L);
        Map<LocalDate, Long> porDia = new TreeMap<>();
        for (LocalDate d = inicio; !d.isAfter(hoy); d = d.plusDays(1)) {
            porDia.put(d, 0L);
        }
        if (idLugar != null) {
            for (VisitaEntity visita : visitaRepository.findByIdLugarAndFechaGreaterThanEqual(idLugar, inicio.atStartOfDay())) {
                porDia.merge(visita.getFecha().toLocalDate(), 1L, Long::sum);
            }
        }
        List<PuntoSerieDTO> serie = new ArrayList<>();
        porDia.forEach((fecha, valor) -> serie.add(new PuntoSerieDTO(fecha, valor)));
        return serie;
    }

    private static Double cambio(long actual, long anterior) {
        if (anterior == 0) {
            return null;
        }
        return Math.round((actual - anterior) * 1000.0 / anterior) / 10.0;
    }

    private void copiarMision(MisionRequest request, MisionEntity mision) {
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw ApiException.peticionInvalida("El nombre de la actividad es obligatorio");
        }
        if (request.puntosXp() == null || request.puntosXp() < 10 || request.puntosXp() > 1000) {
            throw ApiException.peticionInvalida("Los puntos XP deben ir de 10 a 1000");
        }
        mision.setNombre(request.nombre().trim());
        mision.setDescripcion(request.descripcion() == null ? "" : request.descripcion());
        mision.setTipo(request.tipo() == null || request.tipo().isBlank() ? "OTRA" : request.tipo().toUpperCase());
        mision.setPuntosXp(request.puntosXp());
        mision.setActiva(request.activa() == null || request.activa());
    }

    private void validarPromocion(PromocionRequest request) {
        if (request.titulo() == null || request.titulo().isBlank()) {
            throw ApiException.peticionInvalida("El titulo de la promocion es obligatorio");
        }
        if (request.fechaFin() == null) {
            throw ApiException.peticionInvalida("Indica hasta cuando es valida la promocion");
        }
    }

    private PromocionDTO toPromocionDTO(PromocionEntity promocion, NegocioEntity negocio) {
        Integer idLugar = lugarRepository.findFirstByIdNegocio(negocio.getIdNegocio())
                .map(LugarEntity::getIdLugar).orElse(null);
        return promocionMapper.toPromocionDTO(promocion, nombreDe(negocio), idLugar);
    }

    private String nombreDe(NegocioEntity negocio) {
        return usuarioRepository.findById(negocio.getIdUsuario()).map(UsuarioEntity::getNombre).orElse("");
    }

    private NegocioEntity buscarNegocio(Integer idNegocio) {
        return negocioRepository.findById(idNegocio)
                .orElseThrow(() -> ApiException.noEncontrado("No existe el negocio " + idNegocio));
    }

    private MisionEntity buscarMisionDelNegocio(Integer idNegocio, Integer idMision) {
        Integer idLugar = lugarRepository.findFirstByIdNegocio(idNegocio).map(LugarEntity::getIdLugar).orElse(null);
        return misionRepository.findById(idMision)
                .filter(m -> m.getIdLugar().equals(idLugar))
                .orElseThrow(() -> ApiException.noEncontrado("Esa actividad no es de tu negocio"));
    }

    private PromocionEntity buscarPromocionDelNegocio(Integer idNegocio, Integer idPromocion) {
        return promocionRepository.findById(idPromocion)
                .filter(p -> p.getIdNegocio().equals(idNegocio))
                .orElseThrow(() -> ApiException.noEncontrado("Esa promocion no es de tu negocio"));
    }
}
