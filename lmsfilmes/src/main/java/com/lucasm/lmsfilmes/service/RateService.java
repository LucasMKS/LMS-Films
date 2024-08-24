package com.lucasm.lmsfilmes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lucasm.lmsfilmes.dto.RateDTO;
import com.lucasm.lmsfilmes.model.MovieModel;
import com.lucasm.lmsfilmes.repository.MovieRepository;

@Service
public class RateService {

    @Autowired
    private MovieRepository movieRepository;
    
    public RateDTO ratingMovies(RateDTO ratingDTO) {
        try {
            if (movieRepository.findByMovieIdAndNickname(ratingDTO.getMovieId(), ratingDTO.getNickname()).isPresent()) {
                ratingDTO.setStatusCode(400);
                ratingDTO.setError("Você já avaliou este filme.");
                return ratingDTO;
            }

            MovieModel movieModel = new MovieModel();
            movieModel.setTitle(ratingDTO.getTitle());
            movieModel.setMovieId(ratingDTO.getMovieId());
            movieModel.setMyVote(ratingDTO.getRating());
            movieModel.setNickname(ratingDTO.getNickname());
            movieModel.setPoster_path(ratingDTO.getPoster_path());

            // Salvar no banco de dados
            movieRepository.save(movieModel);
            ratingDTO.setStatusCode(200);
            ratingDTO.setMensagem("Filme avaliado com sucesso. Nota: " + ratingDTO.getRating());

        } catch (Exception e) {
            ratingDTO.setStatusCode(500);
            ratingDTO.setError(e.getMessage());
        }
        return ratingDTO;
    }

    public RateDTO ratedContent(String nickname) {
        RateDTO reqDTO = new RateDTO();
        try {
            List<MovieModel> result = movieRepository.findAllByNickname(nickname);
            if (!result.isEmpty()) {
                reqDTO.setMovieList(result);
                reqDTO.setStatusCode(200);
                reqDTO.setMensagem("Filmes avaliados encontrados para o nickname: " + nickname);
            } else {
                reqDTO.setStatusCode(404);
                reqDTO.setError("Nenhum filme avaliado encontrado para o nickname: " + nickname);
            }
        } catch (Exception e) {
            reqDTO.setStatusCode(500);
            reqDTO.setError("Erro ao buscar filmes avaliados: " + e.getMessage());
        }
        return reqDTO;
    }
    
    public RateDTO updateRate(RateDTO ratingDTO) {
        try {
            Optional<MovieModel> movieOptional = movieRepository.findByMovieIdAndNickname(ratingDTO.getMovieId(), ratingDTO.getNickname());
            if (movieOptional.isPresent()) {
                MovieModel movieModel = movieOptional.get();
                movieModel.setMyVote(ratingDTO.getRating());
                movieRepository.save(movieModel);
                ratingDTO.setStatusCode(200);
                ratingDTO.setMensagem("Filme atualizado com sucesso. Nova nota: " + ratingDTO.getRating());
            } else {
                ratingDTO.setStatusCode(404);
                ratingDTO.setError("Filme não encontrado para atualização.");
            }
        } catch (Exception e) {
            ratingDTO.setStatusCode(500);
            ratingDTO.setError(e.getMessage());
        }
        return ratingDTO;
    }

}
