package com.conectaco.conectaco.config;

import com.conectaco.conectaco.dto.RegistroRequest;
import com.conectaco.conectaco.entity.*;
import com.conectaco.conectaco.enums.EstadoInventario;
import com.conectaco.conectaco.enums.EstadoMision;
import com.conectaco.conectaco.enums.EstadoVerificacion;
import com.conectaco.conectaco.enums.TipoUsuario;
import com.conectaco.conectaco.repository.*;
import com.conectaco.conectaco.service.AuthService;
import com.conectaco.conectaco.util.Niveles;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

// Llena la base con datos de ejemplo la primera vez que arranca la app (si no hay categorias).
// Cuentas demo:  turista@conectaco.mx / demo1234   y   cafenin@conectaco.mx / demo1234
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);
    private static final String PASSWORD_DEMO = "demo1234";

    private final CategoriaRepository categoriaRepository;
    private final LugarRepository lugarRepository;
    private final MisionRepository misionRepository;
    private final RecompensaRepository recompensaRepository;
    private final TuristaRepository turistaRepository;
    private final NegocioRepository negocioRepository;
    private final MascotaRepository mascotaRepository;
    private final ProgresoMisionRepository progresoMisionRepository;
    private final InventarioRepository inventarioRepository;
    private final RecuerdoRepository recuerdoRepository;
    private final PromocionRepository promocionRepository;
    private final VisitaRepository visitaRepository;
    private final FavoritoRepository favoritoRepository;
    private final AuthService authService;

    public DatosIniciales(CategoriaRepository categoriaRepository, LugarRepository lugarRepository,
                          MisionRepository misionRepository, RecompensaRepository recompensaRepository,
                          TuristaRepository turistaRepository, NegocioRepository negocioRepository,
                          MascotaRepository mascotaRepository, ProgresoMisionRepository progresoMisionRepository,
                          InventarioRepository inventarioRepository, RecuerdoRepository recuerdoRepository,
                          PromocionRepository promocionRepository, VisitaRepository visitaRepository,
                          FavoritoRepository favoritoRepository, AuthService authService) {
        this.categoriaRepository = categoriaRepository;
        this.lugarRepository = lugarRepository;
        this.misionRepository = misionRepository;
        this.recompensaRepository = recompensaRepository;
        this.turistaRepository = turistaRepository;
        this.negocioRepository = negocioRepository;
        this.mascotaRepository = mascotaRepository;
        this.progresoMisionRepository = progresoMisionRepository;
        this.inventarioRepository = inventarioRepository;
        this.recuerdoRepository = recuerdoRepository;
        this.promocionRepository = promocionRepository;
        this.visitaRepository = visitaRepository;
        this.favoritoRepository = favoritoRepository;
        this.authService = authService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (categoriaRepository.count() > 0) {
            return;
        }
        log.info("Base vacia: cargando datos de ejemplo de conecTaco...");
        Random random = new Random(42);

        int cultura = categoria("Cultura");
        int gastronomia = categoria("Gastronomía");
        int musica = categoria("Música");
        int arte = categoria("Arte");
        int naturaleza = categoria("Naturaleza");

        // Negocio demo con su establecimiento
        UsuarioEntity usuarioNegocio = authService.registrarUsuario(new RegistroRequest(
                "Café Nin", "cafenin@conectaco.mx", PASSWORD_DEMO, TipoUsuario.Negocio));
        NegocioEntity negocio = negocioRepository.findByIdUsuario(usuarioNegocio.getIdUsuario()).orElseThrow();
        negocio.setTelefono("55 1234 5678");
        negocio.setRfc("CNI200101AB1");
        negocio.setHorario("Lun a Dom 7:30 - 22:00");
        negocio.setEstadoVerificacion(EstadoVerificacion.APROBADO);
        negocioRepository.save(negocio);

        LugarEntity cafeNin = lugar("Café Nin", "Café de especialidad, panadería y comida local en una casona " +
                        "de la colonia Juárez. Un espacio para la comunidad.", "Havre 73, Juárez, CDMX",
                19.42520, -99.16190, "Lun a Dom 7:30 - 22:00", "$$", 4.8, gastronomia, negocio.getIdNegocio());
        LugarEntity antropologia = lugar("Museo Nacional de Antropología", "El museo más visitado de México, " +
                        "con la Piedra del Sol y salas de todas las culturas prehispánicas.",
                "Av. Paseo de la Reforma s/n, Chapultepec, CDMX", 19.42600, -99.18630,
                "Mar a Dom 9:00 - 18:00", "$95", 4.9, cultura, null);
        LugarEntity foroIndie = lugar("Foro Indie Rocks!", "Foro de conciertos de música independiente " +
                        "en la Roma Norte.", "Zacatecas 39, Roma Norte, CDMX", 19.41750, -99.15960,
                "Según cartelera", "Varía", 4.6, musica, null);
        LugarEntity cineteca = lugar("Cineteca Nacional", "Cine de arte, ciclos y festivales, con jardines " +
                        "para pasar la tarde.", "Av. México Coyoacán 389, Xoco, CDMX", 19.36000, -99.16420,
                "Todos los días 10:00 - 22:00", "$60", 4.7, arte, null);
        LugarEntity bellasArtes = lugar("Palacio de Bellas Artes", "Recinto cultural con murales de Rivera, " +
                        "Siqueiros y Orozco, y funciones de danza y ópera.", "Av. Juárez s/n, Centro, CDMX",
                19.43520, -99.14120, "Mar a Dom 10:00 - 17:00", "$90", 4.9, cultura, null);
        LugarEntity chapultepec = lugar("Bosque de Chapultepec", "El gran pulmón de la ciudad: lagos, " +
                        "castillo, museos y espacios para caminar.", "Bosque de Chapultepec, Miguel Hidalgo, CDMX",
                19.42040, -99.18190, "Mar a Dom 5:00 - 18:00", "Gratis", 4.8, naturaleza, null);
        LugarEntity mercadoCoyoacan = lugar("Mercado de Coyoacán", "Tostadas, esquites y antojitos en el " +
                        "corazón de Coyoacán.", "Ignacio Allende s/n, Coyoacán, CDMX", 19.35130, -99.16270,
                "Todos los días 8:00 - 20:00", "$", 4.5, gastronomia, null);
        LugarEntity frida = lugar("Museo Frida Kahlo", "La Casa Azul donde vivió Frida Kahlo, con su obra " +
                        "y objetos personales.", "Londres 247, Del Carmen, Coyoacán, CDMX", 19.35510, -99.16260,
                "Mar a Dom 10:00 - 18:00", "$250", 4.7, arte, null);
        LugarEntity xochimilco = lugar("Embarcadero Nuevo Nativitas", "Paseos en trajinera por los canales " +
                        "de Xochimilco, con música y comida a bordo.", "Xochimilco, CDMX", 19.25700, -99.10300,
                "Todos los días 9:00 - 18:00", "$600 por trajinera", 4.4, naturaleza, null);
        LugarEntity garibaldi = lugar("Plaza Garibaldi", "La casa del mariachi: música en vivo y el Museo " +
                        "del Tequila y el Mezcal.", "Eje Central Lázaro Cárdenas, Centro, CDMX", 19.44070, -99.13910,
                "Todos los días", "Gratis", 4.3, musica, null);

        // Actividades (misiones) de cada lugar
        List<MisionEntity> misionesCafe = List.of(
                mision("Toma una foto en nuestro local", "Sube una foto de tu visita a Café Nin", "FOTO", 100, true, cafeNin),
                mision("Prueba nuestro café especial", "Pide el café de la casa y cuéntanos qué te pareció", "VISITA", 150, true, cafeNin),
                mision("Responde nuestro quiz", "¿Cuánto sabes del café mexicano?", "QUIZ", 200, true, cafeNin),
                mision("Desayuno de fin de semana", "Ven a desayunar un sábado o domingo", "VISITA", 120, false, cafeNin));
        List<MisionEntity> otras = new ArrayList<>();
        for (LugarEntity lugar : List.of(antropologia, foroIndie, cineteca, bellasArtes, chapultepec,
                mercadoCoyoacan, frida, xochimilco, garibaldi)) {
            otras.add(mision("Toma una foto en este lugar", "Comparte una foto de " + lugar.getNombre(), "FOTO", 100, true, lugar));
            otras.add(mision("Responde un quiz", "Demuestra lo que sabes de " + lugar.getNombre(), "QUIZ", 150, true, lugar));
        }
        otras.add(mision("Visita 3 lugares cercanos", "Recorre Chapultepec y sus museos", "VISITA", 200, true, chapultepec));
        otras.add(mision("Comparte tu experiencia", "Escribe un recuerdo de tu visita", "COMPARTIR", 50, true, antropologia));

        // Recompensas para la mascota
        RecompensaEntity mono = recompensa("Moño", "ACCESORIO", "Un moño elegante para tu mascota", 200);
        RecompensaEntity gorra = recompensa("Gorra", "ACCESORIO", "Gorra para los días de sol", 300);
        recompensa("Lentes", "ACCESORIO", "Lentes de sol para explorar con estilo", 600);
        recompensa("Bufanda", "ACCESORIO", "Bufanda para las noches frescas de la CDMX", 1000);
        recompensa("Sombrero charro", "ACCESORIO", "El accesorio más mexicano de todos", 1500);

        // Turista demo con progreso
        UsuarioEntity usuarioTurista = authService.registrarUsuario(new RegistroRequest(
                "Alex Turista", "turista@conectaco.mx", PASSWORD_DEMO, TipoUsuario.Turista));
        TuristaEntity turista = turistaRepository.findByIdUsuario(usuarioTurista.getIdUsuario()).orElseThrow();
        int xp = 0;
        for (MisionEntity mision : List.of(misionesCafe.get(0), otras.get(0), otras.get(1), otras.get(2),
                otras.get(4), otras.get(6), otras.get(8), otras.get(19))) {
            completar(turista, mision, LocalDateTime.now().minusDays(random.nextInt(20) + 1));
            xp += mision.getPuntosXp();
        }
        turista.setPuntosExperiencia(xp);
        turista.setNivel(Niveles.nivel(xp));
        turistaRepository.save(turista);

        MascotaEntity mascota = mascotaRepository.findByIdTurista(turista.getIdTurista()).orElseThrow();
        mascota.setExperiencia(xp + 60);
        mascota.setNivel(Niveles.nivel(mascota.getExperiencia()));
        mascotaRepository.save(mascota);
        inventario(turista, mono);
        inventario(turista, gorra);
        mascota.setIdRecompensaEquipada(gorra.getIdRecompensa());
        mascotaRepository.save(mascota);

        recuerdo(turista, cafeNin, "Café Nin", "El mejor pan de la Juárez y un café delicioso.", 5, 12);
        recuerdo(turista, antropologia, "Museo de Antropología", "Ver la Piedra del Sol en persona fue increíble.", 5, 9);
        recuerdo(turista, foroIndie, "Foro Indie Rocks!", "Concierto buenísimo, el sonido del foro es muy bueno.", 4, 6);
        recuerdo(turista, cineteca, "Cineteca Nacional", "Vimos una película francesa y luego caminamos por los jardines.", 5, 3);
        for (LugarEntity lugar : List.of(cafeNin, antropologia, foroIndie, cineteca, bellasArtes,
                chapultepec, frida, garibaldi, mercadoCoyoacan, xochimilco, cafeNin, antropologia)) {
            visita(turista.getIdTurista(), lugar, LocalDateTime.now().minusDays(random.nextInt(25)));
        }
        favorito(turista.getIdTurista(), cafeNin, LocalDateTime.now().minusDays(15));
        favorito(turista.getIdTurista(), antropologia, LocalDateTime.now().minusDays(10));

        // Visitantes de ejemplo para que el negocio demo tenga estadisticas
        for (int i = 1; i <= 14; i++) {
            UsuarioEntity fan = authService.registrarUsuario(new RegistroRequest(
                    "Visitante " + i, "visitante" + i + "@conectaco.mx", PASSWORD_DEMO, TipoUsuario.Turista));
            TuristaEntity t = turistaRepository.findByIdUsuario(fan.getIdUsuario()).orElseThrow();
            favorito(t.getIdTurista(), cafeNin, LocalDateTime.now().minusDays(random.nextInt(55)));
            if (i % 2 == 0) {
                completar(t, misionesCafe.get(random.nextInt(3)), LocalDateTime.now().minusDays(random.nextInt(55)));
            }
        }
        for (int dia = 59; dia >= 0; dia--) {
            int visitasDelDia = 2 + random.nextInt(4) + (59 - dia) / 8;
            for (int v = 0; v < visitasDelDia; v++) {
                visita(null, cafeNin, LocalDateTime.now().minusDays(dia).withHour(8 + random.nextInt(13)));
            }
        }

        promocion(negocio, "2x1 en café", "En cualquier café de la casa, de lunes a jueves", LocalDate.now().plusDays(30), true);
        promocion(negocio, "10% en tu primera visita", "Muestra tu app conecTaco al pagar", LocalDate.now().plusDays(55), true);
        promocion(negocio, "Pan de muerto + café", "Temporada de Día de Muertos", LocalDate.now().minusDays(5), false);

        log.info("Datos de ejemplo listos. Turista: turista@conectaco.mx / {}  Negocio: cafenin@conectaco.mx / {}",
                PASSWORD_DEMO, PASSWORD_DEMO);
    }

    private int categoria(String nombre) {
        CategoriaEntity categoria = new CategoriaEntity();
        categoria.setNombreCategoria(nombre);
        return categoriaRepository.save(categoria).getIdCategoria();
    }

    private LugarEntity lugar(String nombre, String descripcion, String direccion, double latitud, double longitud,
                              String horario, String costo, double calificacion, int idCategoria, Integer idNegocio) {
        LugarEntity lugar = new LugarEntity();
        lugar.setNombre(nombre);
        lugar.setDescripcion(descripcion);
        lugar.setDireccion(direccion);
        lugar.setLatitud(latitud);
        lugar.setLongitud(longitud);
        lugar.setHorario(horario);
        lugar.setCosto(costo);
        lugar.setCalificacionPromedio(calificacion);
        lugar.setIdCategoria(idCategoria);
        lugar.setIdNegocio(idNegocio);
        return lugarRepository.save(lugar);
    }

    private MisionEntity mision(String nombre, String descripcion, String tipo, int xp, boolean activa, LugarEntity lugar) {
        MisionEntity mision = new MisionEntity();
        mision.setNombre(nombre);
        mision.setDescripcion(descripcion);
        mision.setTipo(tipo);
        mision.setPuntosXp(xp);
        mision.setActiva(activa);
        mision.setIdLugar(lugar.getIdLugar());
        return misionRepository.save(mision);
    }

    private RecompensaEntity recompensa(String nombre, String tipo, String descripcion, int requisitoXp) {
        RecompensaEntity recompensa = new RecompensaEntity();
        recompensa.setNombre(nombre);
        recompensa.setTipo(tipo);
        recompensa.setDescripcion(descripcion);
        recompensa.setRequisitoXp(requisitoXp);
        return recompensaRepository.save(recompensa);
    }

    private void completar(TuristaEntity turista, MisionEntity mision, LocalDateTime fecha) {
        ProgresoMisionEntity progreso = new ProgresoMisionEntity();
        progreso.setIdTurista(turista.getIdTurista());
        progreso.setIdMision(mision.getIdMision());
        progreso.setEstado(EstadoMision.COMPLETADA);
        progreso.setFechaAsignacion(fecha.minusHours(2));
        progreso.setFechaCompletado(fecha);
        progresoMisionRepository.save(progreso);
    }

    private void inventario(TuristaEntity turista, RecompensaEntity recompensa) {
        InventarioEntity item = new InventarioEntity();
        item.setIdTurista(turista.getIdTurista());
        item.setIdRecompensa(recompensa.getIdRecompensa());
        item.setFechaCanje(LocalDate.now().minusDays(4));
        item.setEstado(EstadoInventario.DISPONIBLE);
        inventarioRepository.save(item);
    }

    private void recuerdo(TuristaEntity turista, LugarEntity lugar, String titulo, String resena, int calificacion,
                          int haceDias) {
        RecuerdoEntity recuerdo = new RecuerdoEntity();
        recuerdo.setIdTurista(turista.getIdTurista());
        recuerdo.setIdLugar(lugar.getIdLugar());
        recuerdo.setTitulo(titulo);
        recuerdo.setResena(resena);
        recuerdo.setCalificacion(calificacion);
        recuerdo.setFecha(LocalDate.now().minusDays(haceDias));
        recuerdoRepository.save(recuerdo);
    }

    private void visita(Integer idTurista, LugarEntity lugar, LocalDateTime fecha) {
        VisitaEntity visita = new VisitaEntity();
        visita.setIdTurista(idTurista);
        visita.setIdLugar(lugar.getIdLugar());
        visita.setFecha(fecha);
        visitaRepository.save(visita);
    }

    private void favorito(Integer idTurista, LugarEntity lugar, LocalDateTime fecha) {
        FavoritoEntity favorito = new FavoritoEntity();
        favorito.setIdTurista(idTurista);
        favorito.setIdLugar(lugar.getIdLugar());
        favorito.setFecha(fecha);
        favoritoRepository.save(favorito);
    }

    private void promocion(NegocioEntity negocio, String titulo, String descripcion, LocalDate fechaFin, boolean activa) {
        PromocionEntity promocion = new PromocionEntity();
        promocion.setIdNegocio(negocio.getIdNegocio());
        promocion.setTitulo(titulo);
        promocion.setDescripcion(descripcion);
        promocion.setFechaFin(fechaFin);
        promocion.setActiva(activa);
        promocionRepository.save(promocion);
    }
}
