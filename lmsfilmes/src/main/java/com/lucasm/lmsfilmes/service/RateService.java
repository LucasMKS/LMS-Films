package com.lucasm.lmsfilmes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lucasm.lmsfilmes.dto.RateDTO;
import com.lucasm.lmsfilmes.model.MovieModel;
import com.lucasm.lmsfilmes.model.SerieModel;
import com.lucasm.lmsfilmes.repository.MovieRepository;
import com.lucasm.lmsfilmes.repository.SerieRepository;

/**
 * Serviço para gerenciar avaliações de filmes e séries.
 */
@Service
public class RateService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private SerieRepository serieRepository;
    
        /**
     * Avalia um filme.
     * 
     * @param ratingDTO DTO com informações de avaliação do filme
     * @return DTO atualizado com o status da operação
     */
    public RateDTO ratingMovies(RateDTO ratingDTO) {
        RateDTO rateDTO = new RateDTO();
        try {
            // Verificar se o filme já foi avaliado
            if (movieRepository.findByMovieIdAndNickname(ratingDTO.getMovieId(), ratingDTO.getNickname()).isPresent()) {
                rateDTO.setStatusCode(400);
                rateDTO.setError("Você já avaliou este filme.");
                return rateDTO;
            }
            // Converter RateDTO em MovieModel e salvar no banco de dados
            MovieModel movieModel = ratingDTO.toModel();
            movieRepository.save(movieModel);
    
            rateDTO.setStatusCode(200);
            rateDTO.setMensagem("Filme avaliado com sucesso. Nota: " + ratingDTO.getRating());
            return rateDTO;
        } catch (Exception e) {
            rateDTO.setStatusCode(500);
            rateDTO.setError("Erro ao salvar avaliação: " + e.getMessage());
            return rateDTO;
        }
    }
    
    /**
     * Recupera filmes avaliados por um usuário.
     * 
     * @param nickname Nome do usuário
     * @return DTO com a lista de filmes avaliados e o status da operação
     */
    public RateDTO ratedContent(String nickname) {
        RateDTO rateDTO = new RateDTO();
        try {
            List<MovieModel> result = movieRepository.findAllByNickname(nickname);
            if (!result.isEmpty()) {
                rateDTO.setMovieList(result);
                rateDTO.setStatusCode(200);
                rateDTO.setMensagem("Filmes avaliados encontrados para o nickname: " + nickname);
            } else {
                rateDTO.setStatusCode(404);
                rateDTO.setError("Nenhum filme avaliado encontrado para o nickname: " + nickname);
            }
        } catch (Exception e) {
            rateDTO.setStatusCode(500);
            rateDTO.setError("Erro ao buscar filmes avaliados: " + e.getMessage());
        }
        return rateDTO;
    }
         
    
    /**
     * Atualiza a avaliação de um filme existente.
     * 
     * @param ratingDTO DTO com informações de avaliação atualizada do filme
     * @return DTO atualizado com o status da operação
     */
    public RateDTO updateRate(RateDTO ratingDTO) {
        RateDTO rateDTO = new RateDTO();
        try {
            Optional<MovieModel> movieOptional = movieRepository.findByMovieIdAndNickname(ratingDTO.getMovieId(), ratingDTO.getNickname());
            if (movieOptional.isPresent()) {
                MovieModel movieModel = movieOptional.get();
                movieModel.setMyVote(ratingDTO.getRating());
                movieRepository.save(movieModel);

                rateDTO.setStatusCode(200);
                rateDTO.setMensagem("Filme atualizado com sucesso. Nova nota: " + ratingDTO.getRating());
            } else {
                rateDTO.setStatusCode(404);
                rateDTO.setError("Filme não encontrado para atualização.");
            }
        } catch (Exception e) {
            rateDTO.setStatusCode(500);
            rateDTO.setError("Erro ao atualizar avaliação: " + e.getMessage());
        }
        return rateDTO;
    }

    /**
     * Avalia uma série e salva a avaliação no banco de dados.
     * 
     * @param ratingDTO DTO com informações de avaliação da série
     * @return DTO atualizado com o status da operação
     */
    public RateDTO ratingSeries(RateDTO ratingDTO) {
        RateDTO rateDTO = new RateDTO();
        try {
            if (serieRepository.findBySerieIdAndNickname(ratingDTO.getSerieId(), ratingDTO.getNickname()).isPresent()) {
                rateDTO.setStatusCode(400);
                rateDTO.setError("Você já avaliou esta série.");
                return rateDTO;
            }

            SerieModel serieModel = new SerieModel();
            serieModel.setName(ratingDTO.getName());
            serieModel.setSerieId(ratingDTO.getSerieId());
            serieModel.setMyVote(ratingDTO.getRating());
            serieModel.setNickname(ratingDTO.getNickname());
            serieModel.setPoster_path(ratingDTO.getPoster_path());

            // Salvar no banco de dados
            serieRepository.save(serieModel);

            rateDTO.setStatusCode(200);
            rateDTO.setMensagem("Série avaliada com sucesso. Nota: " + ratingDTO.getRating());
            return rateDTO;
        } catch (Exception e) {
            rateDTO.setStatusCode(500);
            rateDTO.setError("Erro ao salvar avaliação: " + e.getMessage());
            return rateDTO;
        }
    }
    
    /**
     * Recupera todas as séries avaliadas por um usuário.
     * 
     * @param nickname Nome do usuário
     * @return DTO com a lista de séries avaliadas e o status da operação
     */
    public RateDTO searchRatedSeries(String nickname) {
        RateDTO rateDTO = new RateDTO();
        try {
            List<SerieModel> result = serieRepository.findAllByNickname(nickname);
            if (!result.isEmpty()) {
                rateDTO.setSerieList(result);
                rateDTO.setStatusCode(200);
                rateDTO.setMensagem("Séries avaliadas encontradas para o nickname: " + nickname);
            } else {
                rateDTO.setStatusCode(404);
                rateDTO.setError("Nenhuma série avaliada encontrada para o nickname: " + nickname);
            }
        } catch (Exception e) {
            rateDTO.setStatusCode(500);
            rateDTO.setError("Erro ao buscar séries avaliadas: " + e.getMessage());
        }
        return rateDTO;
    }

    /**
     * Atualiza a avaliação de uma série existente.
     * 
     * @param ratingDTO DTO com informações de avaliação atualizada da série
     * @return DTO atualizado com o status da operação
     */
    public RateDTO updateRatingSeries(RateDTO ratingDTO) {
        RateDTO rateDTO = new RateDTO();
        try {
            Optional<SerieModel> serieOptional = serieRepository.findBySerieIdAndNickname(ratingDTO.getSerieId(), ratingDTO.getNickname());
            if (serieOptional.isPresent()) {
                SerieModel serieModel = serieOptional.get();
                serieModel.setMyVote(ratingDTO.getRating());
                serieRepository.save(serieModel);

                rateDTO.setStatusCode(200);
                rateDTO.setMensagem("Série atualizada com sucesso. Nova nota: " + ratingDTO.getRating());
            } else {
                rateDTO.setStatusCode(404);
                rateDTO.setError("Série não encontrada para atualização.");
            }
        } catch (Exception e) {
            rateDTO.setStatusCode(500);
            rateDTO.setError("Erro ao atualizar avaliação: " + e.getMessage());
        }
        return rateDTO;
    }
}