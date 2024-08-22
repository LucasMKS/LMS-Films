package com.lucasm.lmsfilmes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lucasm.lmsfilmes.dto.TmdbDTO;
import com.lucasm.lmsfilmes.service.MovieService;

@RestController
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/movies/search")
    public ResponseEntity<List<TmdbDTO>> searchMovies(@RequestParam String query) {
        List<TmdbDTO> movies = movieService.searchMovies(query);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/movies/details/{movieId}")
    public ResponseEntity<TmdbDTO> getMoviesDetails(@PathVariable String movieId) {
        TmdbDTO movie = movieService.getMoviesDetails(movieId);
        return ResponseEntity.ok(movie);
    }

    @GetMapping("/movies/popular")
    public ResponseEntity<List<TmdbDTO>> moviePopular() {
        List<TmdbDTO> movies = movieService.moviePopular();
        return ResponseEntity.ok(movies);
    }

}
