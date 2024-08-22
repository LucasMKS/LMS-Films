package com.lucasm.lmsfilmes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.lucasm.lmsfilmes.dto.ResponseDTO;
import com.lucasm.lmsfilmes.service.AuthService;

@Controller
public class AuthController {

    @Autowired
    private AuthService userService;

     @PostMapping("/auth/register")
    public ResponseEntity<ResponseDTO> regeister(@RequestBody ResponseDTO reg){
        return ResponseEntity.ok(userService.register(reg));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody ResponseDTO req){
        return ResponseEntity.ok(userService.login(req));
    }
}
