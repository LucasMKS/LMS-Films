package com.lucasm.lmsfilmes.repository;

import com.lucasm.lmsfilmes.model.FavoriteModel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para acesso a dados de filmes favoritos.
 */
@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteModel, Long> {

    // Busca todos os filmes favoritos associados a um nickname.
    List<FavoriteModel> findAllByNickname(String nickname);

    // Busca um filme favorito específico por ID e nickname.
    Optional<FavoriteModel> findByMovieIdAndNickname(String movieId, String nickname);

    // Busca um filme favorito específico por nickname e ID.
    Optional<FavoriteModel> findByNicknameAndMovieId(String nickname, String movieId);

    // Busca todos os filmes favoritos associados a um nickname e um estado de favorito.
    List<FavoriteModel> findByNicknameAndFavorite(String nickname, boolean favorite);
}
