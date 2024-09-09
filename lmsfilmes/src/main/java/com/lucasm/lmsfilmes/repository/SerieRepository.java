package com.lucasm.lmsfilmes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lucasm.lmsfilmes.model.SerieModel;

/**
 * Repositório para acesso a dados de séries.
 */
@Repository
public interface SerieRepository extends JpaRepository<SerieModel, Long>  {

    // Busca todas as séries associadas a um nickname.
    List<SerieModel> findAllByNickname(String nickname);

    // Busca uma série específica por ID e nickname.
    Optional<SerieModel> findBySerieIdAndNickname(String serieId, String nickname);
}
