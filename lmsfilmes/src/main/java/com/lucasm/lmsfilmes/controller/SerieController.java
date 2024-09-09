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

import com.lucasm.lmsfilmes.dto.FavoriteSerieDTO;
import com.lucasm.lmsfilmes.dto.SeriesDTO;
import com.lucasm.lmsfilmes.service.SerieService;

/**
 * Controlador de séries.
 */
@RestController
public class SerieController {

    @Autowired
    private SerieService serieService;
 
    // Método para buscar séries por query.
    @GetMapping("/series/search")
    public ResponseEntity<List<SeriesDTO>> searchSeries(@RequestParam String query) {
        List<SeriesDTO> serie = serieService.searchSeries(query);
        return ResponseEntity.ok(serie);
    }

    // Método para obter detalhes de uma série.
    @GetMapping("/series/details/{serieId}")
    public ResponseEntity<SeriesDTO> getSeriesDetails(@PathVariable String serieId) {
        SeriesDTO serie = serieService.getSeriesDetails(serieId);
        return ResponseEntity.ok(serie);
    }

    // Método para obter séries populares.
    @GetMapping("/series/popular")
    public ResponseEntity<List<SeriesDTO>> seriePopular(@RequestParam(defaultValue = "1") int page) {
        List<SeriesDTO> serie = serieService.seriePopular(page);
        return ResponseEntity.ok(serie);
    }

    // Favorites

    // Método para adicionar ou remover uma série dos favoritos.
    @PostMapping("/series/favorite")
    public ResponseEntity<String> toggleSerieFavorite(@RequestBody FavoriteSerieDTO favorite) {
        serieService.toggleSerieFavorite(favorite);
        return ResponseEntity.ok("Favorite status updated");
    }

    // Método para obter o status de favorito de uma série.
    @GetMapping("/series/favoritestatus")
    public ResponseEntity<FavoriteSerieDTO> getFavoriteStatus(@RequestParam String serieId, @RequestParam String nickname) {
        boolean isFavorite = serieService.isFavorite(serieId, nickname);
        return ResponseEntity.ok(new FavoriteSerieDTO(isFavorite));
    }

    // Método para obter todas as séries favoritas de um usuário.
    @GetMapping("/series/getfavorites")
    public ResponseEntity<FavoriteSerieDTO> getAllSeriesFavorites(@RequestParam String nickname) {
        FavoriteSerieDTO series = serieService.getAllSeriesFavorites(nickname);
        return ResponseEntity.ok(series);
    }
}
