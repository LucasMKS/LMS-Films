package com.lucasm.lmsfilmes.service;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lucasm.lmsfilmes.dto.ResponseDTO;
import com.lucasm.lmsfilmes.model.UserModel;
import com.lucasm.lmsfilmes.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

  public ResponseDTO register(ResponseDTO registrationRequest){
    ResponseDTO resp = new ResponseDTO();

    try {
        if (usersRepo.findByEmail(registrationRequest.getEmail()).isPresent()) {
            resp.setStatusCode(400);
            resp.setError("E-mail já cadastrado.");
            return resp;
        }
        if (usersRepo.findByNickname(registrationRequest.getNickname()).isPresent()) {
            resp.setStatusCode(400);
            resp.setError("Username já cadastrado.");
            return resp;
        }

        // Cria um novo usuário
        UserModel ourUser = new UserModel();
        ourUser.setName(registrationRequest.getName());
        ourUser.setEmail(registrationRequest.getEmail());
        ourUser.setNickname(registrationRequest.getNickname());
        if(registrationRequest.getRole() != null){
            ourUser.setRole(registrationRequest.getRole());
        }
        ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        UserModel ourUsersResult = usersRepo.save(ourUser);
        if (ourUsersResult.getId()>0) {
            resp.setOurUsers((ourUsersResult));
            resp.setMessage("Usuário cadastrado com sucesso");
            resp.setStatusCode(200);
        }

    }catch (Exception e){
        resp.setStatusCode(500);
        resp.setError(e.getMessage());
    }
    return resp;
}

    public ResponseDTO login(ResponseDTO loginRequest) {
        ResponseDTO response = new ResponseDTO();
        try {
            // Autentica o usuário
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            // Recupera o usuário do banco de dados
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            // Preenche a resposta com os dados do usuário e tokens
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setNickname(user.getNickname());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage(user.getName() + " Logado com sucesso");

        } catch (UsernameNotFoundException e) {
            response.setStatusCode(404); // Not Found
            response.setError("Usuário não encontrado.");
        } catch (BadCredentialsException e) {
            response.setStatusCode(401); // Unauthorized
            response.setError("Credenciais inválidas.");
        } catch (Exception e) {
            response.setStatusCode(500); // Internal Server Error
            response.setError("Erro interno do servidor.");
        }
        return response;
    }

}
