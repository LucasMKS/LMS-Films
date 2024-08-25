package com.lucasm.lmsfilmes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lucasm.lmsfilmes.model.SerieModel;


@Repository
public interface SerieRepository extends JpaRepository<SerieModel, Long>  {
    List<SerieModel> findAllByNickname(String nickname);
    Optional<SerieModel> findBySerieIdAndNickname(String serieId, String nickname);
}
