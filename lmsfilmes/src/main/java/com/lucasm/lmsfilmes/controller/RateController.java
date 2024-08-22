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

    @PostMapping("/rate/save")
    public ResponseEntity<RateDTO> ratingMovies(@RequestBody RateDTO ratingDTO) {
        return ResponseEntity.ok(rateService.ratingMovies(ratingDTO));
    }

    @GetMapping("/rate/ratedcontent")
    public ResponseEntity<RateDTO> searchMovies(@RequestParam String nickname) {
        RateDTO movies = rateService.ratedContent(nickname);
        return ResponseEntity.ok(movies);
    }

    @PutMapping("rate/update")
    public ResponseEntity<RateDTO> updateRating(@RequestBody RateDTO ratingDTO) {
        RateDTO updatedRating = rateService.updateRate(ratingDTO);
        return ResponseEntity.ok(updatedRating);
    }

}
