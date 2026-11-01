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
import java.util.ArrayList;
import java.util.List;

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
        String nombre = nombreDelNegocio(negocio);
        LugarEntity lugar = lugarDelNegocio(idNegocio);

        // Negocio recien registrado: todavia no tiene establecimiento
        if (lugar == null) {
            return new NegocioDashboardDTO(nombre, null, 0, 0, 0, visitasPorDia(null, 30));
        }

        Integer idLugar = lugar.getIdLugar();
        return new NegocioDashboardDTO(nombre, lugarService.toDTO(lugar, null),
                visitaRepository.countByIdLugar(idLugar), misionRepository.findByIdLugar(idLugar).size(),
                favoritoRepository.countByIdLugar(idLugar), visitasPorDia(idLugar, 30));
    }

    @Override
    public LugarDTO lugar(Integer idNegocio) {
        buscarNegocio(idNegocio);

        LugarEntity lugar = lugarDelNegocio(idNegocio);
        if (lugar == null) {
            return null;
        }
        return lugarService.toDTO(lugar, null);
    }

    // La primera vez crea el establecimiento; despues lo actualiza
    @Override
    @Transactional
    public LugarDTO guardarLugar(Integer idNegocio, LugarRequest request) {
        buscarNegocio(idNegocio);

        if (request.nombre() == null || request.nombre().isBlank()) {
            throw ApiException.peticionInvalida("El nombre del establecimiento es obligatorio");
        }
        if (request.direccion() == null || request.direccion().isBlank()) {
            throw ApiException.peticionInvalida("La direccion es obligatoria");
        }
        if (request.idCategoria() == null || !categoriaRepository.existsById(request.idCategoria())) {
            throw ApiException.peticionInvalida("Elige una categoria valida");
        }

        LugarEntity lugar = lugarDelNegocio(idNegocio);
        if (lugar == null) {
            lugar = new LugarEntity();
            lugar.setIdNegocio(idNegocio);
            lugar.setCalificacionPromedio(0.0);
        }
        lugarMapper.copiar(request, lugar);

        // Valores por default para lo que el negocio deje vacio
        if (lugar.getDescripcion() == null) {
            lugar.setDescripcion("");
        }
        if (lugar.getHorario() == null || lugar.getHorario().isBlank()) {
            lugar.setHorario("Por definir");
        }
        if (lugar.getCosto() == null || lugar.getCosto().isBlank()) {
            lugar.setCosto("$$");
        }
        if (lugar.getLatitud() == null) {
            lugar.setLatitud(LATITUD_CDMX);
        }
        if (lugar.getLongitud() == null) {
            lugar.setLongitud(LONGITUD_CDMX);
        }

        lugar = lugarRepository.save(lugar);
        return lugarService.toDTO(lugar, null);
    }

    @Override
    public List<MisionDTO> misiones(Integer idNegocio) {
        buscarNegocio(idNegocio);

        List<MisionDTO> misiones = new ArrayList<>();
        LugarEntity lugar = lugarDelNegocio(idNegocio);
        if (lugar != null) {
            for (MisionEntity mision : misionRepository.findByIdLugar(lugar.getIdLugar())) {
                misiones.add(misionMapper.toMisionDTO(mision, lugar.getNombre(), null));
            }
        }
        return misiones;
    }

    @Override
    @Transactional
    public MisionDTO crearMision(Integer idNegocio, MisionRequest request) {
        buscarNegocio(idNegocio);

        LugarEntity lugar = lugarDelNegocio(idNegocio);
        if (lugar == null) {
            throw ApiException.peticionInvalida("Primero registra tu establecimiento en \"Mi establecimiento\"");
        }

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

        String nombreLugar = lugarService.buscar(mision.getIdLugar()).getNombre();
        return misionMapper.toMisionDTO(mision, nombreLugar, null);
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
        promocion = promocionRepository.save(promocion);

        return toPromocionDTO(promocion, negocio);
    }

    @Override
    @Transactional
    public PromocionDTO actualizarPromocion(Integer idNegocio, Integer idPromocion, PromocionRequest request) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        validarPromocion(request);

        PromocionEntity promocion = buscarPromocionDelNegocio(idNegocio, idPromocion);
        promocionMapper.copiar(request, promocion);
        promocion = promocionRepository.save(promocion);

        return toPromocionDTO(promocion, negocio);
    }

    @Override
    @Transactional
    public void eliminarPromocion(Integer idNegocio, Integer idPromocion) {
        promocionRepository.delete(buscarPromocionDelNegocio(idNegocio, idPromocion));
    }

    // Las promociones activas y sin vencer de todos los negocios (las ve el turista)
    @Override
    public List<PromocionDTO> promocionesVigentes() {
        List<PromocionDTO> promociones = new ArrayList<>();
        LocalDate hoy = LocalDate.now();

        for (PromocionEntity promocion : promocionRepository.findByActivaTrueAndFechaFinGreaterThanEqualOrderByFechaFinAsc(hoy)) {
            NegocioEntity negocio = negocioRepository.findById(promocion.getIdNegocio()).orElse(null);
            if (negocio != null) {
                promociones.add(toPromocionDTO(promocion, negocio));
            }
        }
        return promociones;
    }

    // Compara los ultimos "dias" contra los mismos dias de antes.
    // Ejemplo con dias = 30: ultimos 30 dias contra los 30 anteriores.
    @Override
    public EstadisticasDTO estadisticas(Integer idNegocio, int dias) {
        buscarNegocio(idNegocio);
        if (dias < 1 || dias > 365) {
            throw ApiException.peticionInvalida("Los dias deben ir de 1 a 365");
        }

        LugarEntity lugar = lugarDelNegocio(idNegocio);
        if (lugar == null) {
            return new EstadisticasDTO(dias, 0, null, 0, null, 0, null, visitasPorDia(null, dias));
        }
        Integer idLugar = lugar.getIdLugar();

        LocalDateTime fin = LocalDate.now().plusDays(1).atStartOfDay();
        LocalDateTime inicio = fin.minusDays(dias);
        LocalDateTime inicioAnterior = inicio.minusDays(dias);

        long visitas = visitaRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, inicio, fin);
        long visitasAntes = visitaRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, inicioAnterior, inicio);

        long completadas = progresoMisionRepository.contarCompletadasEnLugar(idLugar, EstadoMision.COMPLETADA, inicio, fin);
        long completadasAntes = progresoMisionRepository.contarCompletadasEnLugar(idLugar, EstadoMision.COMPLETADA, inicioAnterior, inicio);

        long seguidores = favoritoRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, inicio, fin);
        long seguidoresAntes = favoritoRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(idLugar, inicioAnterior, inicio);

        return new EstadisticasDTO(dias, visitas, porcentajeDeCambio(visitas, visitasAntes),
                completadas, porcentajeDeCambio(completadas, completadasAntes),
                seguidores, porcentajeDeCambio(seguidores, seguidoresAntes),
                visitasPorDia(idLugar, dias));
    }

    @Override
    public NegocioPerfilDTO perfil(Integer idNegocio) {
        NegocioEntity negocio = buscarNegocio(idNegocio);
        UsuarioEntity usuario = usuarioRepository.findById(negocio.getIdUsuario()).orElseThrow();

        // Datos que vienen del establecimiento (si ya lo registro)
        String categoria = null;
        String direccion = null;
        String imagenUrl = null;
        LugarEntity lugar = lugarDelNegocio(idNegocio);
        if (lugar != null) {
            direccion = lugar.getDireccion();
            imagenUrl = lugar.getImagenUrl();
            CategoriaEntity categoriaEntity = categoriaRepository.findById(lugar.getIdCategoria()).orElse(null);
            if (categoriaEntity != null) {
                categoria = categoriaEntity.getNombreCategoria();
            }
        }

        return new NegocioPerfilDTO(idNegocio, usuario.getNombre(), usuario.getEmail(), negocio.getRfc(),
                negocio.getTelefono(), negocio.getHorario(), negocio.getEstadoVerificacion(), categoria,
                direccion, imagenUrl);
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

    // Una lista con las visitas de cada dia, para dibujar la grafica
    private List<PuntoSerieDTO> visitasPorDia(Integer idLugar, int dias) {
        List<PuntoSerieDTO> serie = new ArrayList<>();

        for (int i = dias - 1; i >= 0; i--) {
            LocalDate dia = LocalDate.now().minusDays(i);
            long visitas = 0;
            if (idLugar != null) {
                visitas = visitaRepository.countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(
                        idLugar, dia.atStartOfDay(), dia.plusDays(1).atStartOfDay());
            }
            serie.add(new PuntoSerieDTO(dia, visitas));
        }
        return serie;
    }

    // Ejemplo: antes 100, ahora 150 => 50.0 (subio 50%). Si antes era 0 no se puede calcular.
    private Double porcentajeDeCambio(long actual, long anterior) {
        if (anterior == 0) {
            return null;
        }
        double porcentaje = (actual - anterior) * 100.0 / anterior;
        return Math.round(porcentaje * 10) / 10.0;
    }

    private void copiarMision(MisionRequest request, MisionEntity mision) {
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw ApiException.peticionInvalida("El nombre de la actividad es obligatorio");
        }
        if (request.puntosXp() == null || request.puntosXp() < 10 || request.puntosXp() > 1000) {
            throw ApiException.peticionInvalida("Los puntos XP deben ir de 10 a 1000");
        }

        mision.setNombre(request.nombre().trim());

        if (request.descripcion() == null) {
            mision.setDescripcion("");
        } else {
            mision.setDescripcion(request.descripcion());
        }

        if (request.tipo() == null || request.tipo().isBlank()) {
            mision.setTipo("OTRA");
        } else {
            mision.setTipo(request.tipo().toUpperCase());
        }

        mision.setPuntosXp(request.puntosXp());

        // Si no dicen nada, se publica. activa = false la deja como borrador.
        if (request.activa() == null) {
            mision.setActiva(true);
        } else {
            mision.setActiva(request.activa());
        }
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
        Integer idLugar = null;
        LugarEntity lugar = lugarDelNegocio(negocio.getIdNegocio());
        if (lugar != null) {
            idLugar = lugar.getIdLugar();
        }
        return promocionMapper.toPromocionDTO(promocion, nombreDelNegocio(negocio), idLugar);
    }

    private String nombreDelNegocio(NegocioEntity negocio) {
        UsuarioEntity usuario = usuarioRepository.findById(negocio.getIdUsuario()).orElse(null);
        if (usuario == null) {
            return "";
        }
        return usuario.getNombre();
    }

    // Regresa el establecimiento del negocio, o null si todavia no lo registra
    private LugarEntity lugarDelNegocio(Integer idNegocio) {
        return lugarRepository.findFirstByIdNegocio(idNegocio).orElse(null);
    }

    private NegocioEntity buscarNegocio(Integer idNegocio) {
        NegocioEntity negocio = negocioRepository.findById(idNegocio).orElse(null);
        if (negocio == null) {
            throw ApiException.noEncontrado("No existe el negocio " + idNegocio);
        }
        return negocio;
    }

    // Revisa que la actividad sea de este negocio (para que nadie edite las de otro)
    private MisionEntity buscarMisionDelNegocio(Integer idNegocio, Integer idMision) {
        LugarEntity lugar = lugarDelNegocio(idNegocio);
        MisionEntity mision = misionRepository.findById(idMision).orElse(null);

        if (lugar == null || mision == null || !mision.getIdLugar().equals(lugar.getIdLugar())) {
            throw ApiException.noEncontrado("Esa actividad no es de tu negocio");
        }
        return mision;
    }

    private PromocionEntity buscarPromocionDelNegocio(Integer idNegocio, Integer idPromocion) {
        PromocionEntity promocion = promocionRepository.findById(idPromocion).orElse(null);

        if (promocion == null || !promocion.getIdNegocio().equals(idNegocio)) {
            throw ApiException.noEncontrado("Esa promocion no es de tu negocio");
        }
        return promocion;
    }
}
