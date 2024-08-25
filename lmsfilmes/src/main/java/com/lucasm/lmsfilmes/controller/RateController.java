package com.lucasm.lmsfilmes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lucasm.lmsfilmes.dto.RateDTO;
import com.lucasm.lmsfilmes.service.RateService;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class RateController {

    @Autowired
    private RateService rateService;

    @PostMapping("/rate/m/save")
    public ResponseEntity<RateDTO> ratingMovies(@RequestBody RateDTO ratingDTO) {
        return ResponseEntity.ok(rateService.ratingMovies(ratingDTO));
    }

    @GetMapping("/rate/m/ratedcontent")
    public ResponseEntity<RateDTO> searchMovies(@RequestParam String nickname) {
        RateDTO movies = rateService.ratedContent(nickname);
        return ResponseEntity.ok(movies);
    }

    @PutMapping("rate/m/update")
    public ResponseEntity<RateDTO> updateRating(@RequestBody RateDTO ratingDTO) {
        RateDTO updatedRating = rateService.updateRate(ratingDTO);
        return ResponseEntity.ok(updatedRating);
    }

    @PostMapping("/rate/s/save")
    public ResponseEntity<RateDTO> ratingSeries(@RequestBody RateDTO ratingDTO) {
        return ResponseEntity.ok(rateService.ratingSeries(ratingDTO));
    }

    @GetMapping("/rate/s/ratedcontent")
    public ResponseEntity<RateDTO> searchRatedSeries(@RequestParam String nickname) {
        RateDTO movies = rateService.searchRatedSeries(nickname);
        return ResponseEntity.ok(movies);
    }

    @PutMapping("rate/s/update")
    public ResponseEntity<RateDTO> updateRatingSeries(@RequestBody RateDTO ratingDTO) {
        RateDTO updatedRating = rateService.updateRatingSeries(ratingDTO);
        return ResponseEntity.ok(updatedRating);
    }

}
