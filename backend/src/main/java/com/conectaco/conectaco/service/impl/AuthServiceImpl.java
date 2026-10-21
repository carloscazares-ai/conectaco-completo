package com.conectaco.conectaco.service.impl;

import com.conectaco.conectaco.dto.LoginRequest;
import com.conectaco.conectaco.dto.RegistroRequest;
import com.conectaco.conectaco.dto.SesionDTO;
import com.conectaco.conectaco.entity.MascotaEntity;
import com.conectaco.conectaco.entity.NegocioEntity;
import com.conectaco.conectaco.entity.TuristaEntity;
import com.conectaco.conectaco.entity.UsuarioEntity;
import com.conectaco.conectaco.enums.EstadoVerificacion;
import com.conectaco.conectaco.enums.TipoUsuario;
import com.conectaco.conectaco.exception.ApiException;
import com.conectaco.conectaco.repository.MascotaRepository;
import com.conectaco.conectaco.repository.NegocioRepository;
import com.conectaco.conectaco.repository.TuristaRepository;
import com.conectaco.conectaco.repository.UsuarioRepository;
import com.conectaco.conectaco.service.AuthService;
import com.conectaco.conectaco.util.PasswordUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final TuristaRepository turistaRepository;
    private final NegocioRepository negocioRepository;
    private final MascotaRepository mascotaRepository;

    public AuthServiceImpl(UsuarioRepository usuarioRepository, TuristaRepository turistaRepository,
                           NegocioRepository negocioRepository, MascotaRepository mascotaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.turistaRepository = turistaRepository;
        this.negocioRepository = negocioRepository;
        this.mascotaRepository = mascotaRepository;
    }

    @Override
    @Transactional
    public SesionDTO registrar(RegistroRequest request) {
        return sesionDe(registrarUsuario(request));
    }

    // Crea el usuario y, segun su tipo, su registro de Turista (con mascota) o de Negocio.
    @Override
    @Transactional
    public UsuarioEntity registrarUsuario(RegistroRequest request) {
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw ApiException.peticionInvalida("El nombre es obligatorio");
        }
        if (request.email() == null || !request.email().contains("@")) {
            throw ApiException.peticionInvalida("Escribe un email valido");
        }
        if (request.password() == null || request.password().length() < 6) {
            throw ApiException.peticionInvalida("La contrasena debe tener al menos 6 caracteres");
        }
        if (request.tipoUsuario() == null) {
            throw ApiException.peticionInvalida("Elige si eres Turista o Negocio");
        }
        String email = request.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflicto("Ya existe una cuenta con ese email");
        }

        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setNombre(request.nombre().trim());
        usuario.setEmail(email);
        usuario.setPassword(PasswordUtil.cifrar(request.password()));
        usuario.setTipoUsuario(request.tipoUsuario());
        usuario = usuarioRepository.save(usuario);

        if (request.tipoUsuario() == TipoUsuario.Turista) {
            TuristaEntity turista = new TuristaEntity();
            turista.setIdUsuario(usuario.getIdUsuario());
            turista.setIdiomaPreferido("es");
            turista.setNivel(1);
            turista.setPuntosExperiencia(0);
            turista = turistaRepository.save(turista);

            MascotaEntity mascota = new MascotaEntity();
            mascota.setIdTurista(turista.getIdTurista());
            mascota.setNombre("Michi");
            mascota.setNivel(1);
            mascota.setExperiencia(0);
            mascotaRepository.save(mascota);
        } else {
            NegocioEntity negocio = new NegocioEntity();
            negocio.setIdUsuario(usuario.getIdUsuario());
            negocio.setEstadoVerificacion(EstadoVerificacion.PENDIENTE);
            negocioRepository.save(negocio);
        }
        return usuario;
    }

    @Override
    public SesionDTO login(LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            throw ApiException.peticionInvalida("Escribe tu email y tu contrasena");
        }
        UsuarioEntity usuario = usuarioRepository.findByEmailIgnoreCase(request.email().trim())
                .filter(u -> PasswordUtil.coincide(request.password(), u.getPassword()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email o contrasena incorrectos"));
        return sesionDe(usuario);
    }

    private SesionDTO sesionDe(UsuarioEntity usuario) {
        Integer idTurista = turistaRepository.findByIdUsuario(usuario.getIdUsuario())
                .map(TuristaEntity::getIdTurista).orElse(null);
        Integer idNegocio = negocioRepository.findByIdUsuario(usuario.getIdUsuario())
                .map(NegocioEntity::getIdNegocio).orElse(null);
        return new SesionDTO(usuario.getIdUsuario(), usuario.getNombre(), usuario.getEmail(),
                usuario.getTipoUsuario(), idTurista, idNegocio);
    }
}
