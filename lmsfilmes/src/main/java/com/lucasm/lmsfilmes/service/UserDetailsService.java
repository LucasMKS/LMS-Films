package com.lucasm.lmsfilmes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lucasm.lmsfilmes.repository.UserRepository;

/**
 * Serviço que carrega detalhes do usuário para autenticação.
 */
@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository; // Renomeado para userRepository para clareza

    /**
     * Carrega um usuário pelo e-mail. Isso é necessário para autenticação.
     * 
     * @param email O e-mail do usuário
     * @return Os detalhes do usuário
     * @throws UsernameNotFoundException Se o usuário não for encontrado
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca usuário pelo e-mail e lança exceção se não for encontrado
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));
    }
}
