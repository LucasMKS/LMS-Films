package com.lucasm.lmsfilmes.repository;

import com.lucasm.lmsfilmes.model.FavoriteSerieModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteSerieRepository extends JpaRepository<FavoriteSerieModel, Long> {
    List<FavoriteSerieModel> findAllByNickname(String nickname);
    Optional<FavoriteSerieModel> findBySerieIdAndNickname(String serieId, String nickname);
    List<FavoriteSerieModel> findByNicknameAndFavorite(String nickname, boolean favorite);
}
