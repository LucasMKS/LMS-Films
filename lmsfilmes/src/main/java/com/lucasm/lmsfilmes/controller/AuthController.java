package com.lucasm.lmsfilmes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.lucasm.lmsfilmes.dto.ResponseDTO;
import com.lucasm.lmsfilmes.service.AuthService;

/**
 * Controlador de autenticação.
 */
@Controller
public class AuthController {

    @Autowired
    private AuthService authService;

    // Método para registrar um novo usuário.
    @PostMapping("/auth/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody ResponseDTO reg) {
        return ResponseEntity.ok(authService.register(reg));
    }

    // Método para realizar login.
    @PostMapping("/auth/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody ResponseDTO req) {
        return ResponseEntity.ok(authService.login(req));
    }
}