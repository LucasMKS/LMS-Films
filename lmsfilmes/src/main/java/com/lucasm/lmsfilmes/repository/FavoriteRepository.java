package com.lucasm.lmsfilmes.repository;

import com.lucasm.lmsfilmes.model.FavoriteModel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteModel, Long> {
    List<FavoriteModel> findAllByNickname(String nickname);
    Optional<FavoriteModel> findByMovieIdAndNickname(String movieId, String nickname);
}
