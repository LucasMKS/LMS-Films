package com.lucasm.lmsfilmes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lucasm.lmsfilmes.dto.RateDTO;
import com.lucasm.lmsfilmes.service.RateService;

/**
 * Controlador de avaliações.
 */
@RestController
public class RateController {

    @Autowired
    private RateService rateService;

    // Método para avaliar um filme.
    @PostMapping("/rate/m/save")
    public ResponseEntity<RateDTO> ratingMovies(@RequestBody RateDTO ratingDTO) {
        return ResponseEntity.ok(rateService.ratingMovies(ratingDTO));
    }

    // Método para obter as avaliações de um usuário.
    @GetMapping("/rate/m/ratedcontent")
    public ResponseEntity<RateDTO> searchMovies(@RequestParam String nickname) {
        RateDTO movies = rateService.ratedContent(nickname);
        return ResponseEntity.ok(movies);
    }

    // Método para atualizar uma avaliação.
    @PutMapping("rate/m/update")
    public ResponseEntity<RateDTO> updateRating(@RequestBody RateDTO ratingDTO) {
        RateDTO updatedRating = rateService.updateRate(ratingDTO);
        return ResponseEntity.ok(updatedRating);
    }

    // Método para avaliar uma série.
    @PostMapping("/rate/s/save")
    public ResponseEntity<RateDTO> ratingSeries(@RequestBody RateDTO ratingDTO) {
        return ResponseEntity.ok(rateService.ratingSeries(ratingDTO));
    }

    // Método para obter as avaliações de uma série.
    @GetMapping("/rate/s/ratedcontent")
    public ResponseEntity<RateDTO> searchRatedSeries(@RequestParam String nickname) {
        RateDTO movies = rateService.searchRatedSeries(nickname);
        return ResponseEntity.ok(movies);
    }

    // Método para atualizar uma avaliação de uma série.
    @PutMapping("rate/s/update")
    public ResponseEntity<RateDTO> updateRatingSeries(@RequestBody RateDTO ratingDTO) {
        RateDTO updatedRating = rateService.updateRatingSeries(ratingDTO);
        return ResponseEntity.ok(updatedRating);
    }
}