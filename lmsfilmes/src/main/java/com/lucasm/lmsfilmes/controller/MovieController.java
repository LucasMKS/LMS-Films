package com.lucasm.lmsfilmes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lucasm.lmsfilmes.dto.FavoriteDTO;
import com.lucasm.lmsfilmes.dto.TmdbDTO;
import com.lucasm.lmsfilmes.service.MovieService;

/**
 * Controlador de filmes.
 */
@RestController
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Método para buscar filmes por query.
    @GetMapping("/movies/search")
    public ResponseEntity<List<TmdbDTO>> searchMovies(@RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        List<TmdbDTO> movies = movieService.searchMovies(query, page);
        return ResponseEntity.ok(movies);
    }

    // Método para obter detalhes de um filme.
    @GetMapping("/movies/details/{movieId}")
    public ResponseEntity<TmdbDTO> getMoviesDetails(@PathVariable String movieId) {
        TmdbDTO movie = movieService.getMoviesDetails(movieId);
        return ResponseEntity.ok(movie);
    }

    // Método para obter filmes populares.
    @GetMapping("/movies/popular")
    public ResponseEntity<List<TmdbDTO>> moviePopular(@RequestParam(defaultValue = "1") int page) {
        List<TmdbDTO> movies = movieService.moviePopular(page);
        return ResponseEntity.ok(movies);
    }

    // Método para adicionar/remover um filme dos favoritos.
    @PostMapping("/movies/favorite")
    public ResponseEntity<String> toggleFavorite(@RequestBody FavoriteDTO favorite) {
        movieService.toggleFavorite(favorite);
        return ResponseEntity.ok("Favorite status updated");
    }

    // Método para verificar se um filme é favorito.
    @GetMapping("/movies/favoritestatus")
    public ResponseEntity<FavoriteDTO> getFavoriteStatus(@RequestParam String movieId, @RequestParam String nickname) {
        boolean isFavorite = movieService.isFavorite(movieId, nickname);
        return ResponseEntity.ok(new FavoriteDTO(isFavorite));
    }

    // Método para obter todos os filmes favoritos de um usuário.
    @GetMapping("/movies/getfavorites")
    public ResponseEntity<FavoriteDTO> getAllFavorites(@RequestParam String nickname) {
        FavoriteDTO movies = movieService.getAllFavorites(nickname);
        return ResponseEntity.ok(movies);
    }
}