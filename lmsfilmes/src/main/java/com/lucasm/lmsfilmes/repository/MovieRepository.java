package com.lucasm.lmsfilmes.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lucasm.lmsfilmes.model.MovieModel;

@Repository
public interface MovieRepository extends JpaRepository<MovieModel, Long> {
    List<MovieModel> findAllByNickname(String nickname);
    Optional<MovieModel> findByMovieIdAndNickname(String movieId, String nickname);

}
