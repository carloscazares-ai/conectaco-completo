package com.conectaco.conectaco.controller;

import com.conectaco.conectaco.dto.LoginRequest;
import com.conectaco.conectaco.dto.RegistroRequest;
import com.conectaco.conectaco.dto.SesionDTO;
import com.conectaco.conectaco.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public SesionDTO registro(@RequestBody RegistroRequest request) {
        return authService.registrar(request);
    }

    @PostMapping("/login")
    public SesionDTO login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
