package com.lucasm.lmsfilmes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lucasm.lmsfilmes.dto.RateDTO;
import com.lucasm.lmsfilmes.model.MovieModel;
import com.lucasm.lmsfilmes.repository.MovieRepository;

@Service
public class RateService {

    @Autowired
    private MovieRepository movieRepository;

    private RateDTO reqDTO = new RateDTO();

    public RateDTO ratingMovies(RateDTO ratingDTO) {
        try {
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
            ratingDTO.setMensagem(e.getMessage());
            System.err.println("Erro ao salvar filme: " + e.getMessage());
        }
        return ratingDTO;
    }

    public RateDTO ratedContent(String nickname) {
        try {
            List<MovieModel> result = movieRepository.findAllByNickname(nickname);
            if (!result.isEmpty()) {
                reqDTO.setMovieList(result);
                reqDTO.setStatusCode(200);
                reqDTO.setMensagem("Filmes avaliados encontrados para o nickname: " + nickname);
            } else {
                reqDTO.setStatusCode(404);
                reqDTO.setMensagem("Nenhum filme avaliado encontrado para o nickname: " + nickname);
            }
            return reqDTO;
        } catch (Exception e) {
            reqDTO.setStatusCode(500);
            reqDTO.setMensagem("Erro ao buscar filmes avaliados: " + e.getMessage());
            return reqDTO;
        }
    }

    
}
