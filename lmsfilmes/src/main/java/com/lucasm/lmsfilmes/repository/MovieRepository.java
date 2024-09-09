package com.lucasm.lmsfilmes.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lucasm.lmsfilmes.model.MovieModel;

/**
 * Repositório para acesso a dados de filmes.
 */
@Repository
public interface MovieRepository extends JpaRepository<MovieModel, Long> {

    // Busca todos os filmes associados a um nickname.
    List<MovieModel> findAllByNickname(String nickname);

    // Busca um filme específico por ID e nickname.
    Optional<MovieModel> findByMovieIdAndNickname(String movieId, String nickname);

}
