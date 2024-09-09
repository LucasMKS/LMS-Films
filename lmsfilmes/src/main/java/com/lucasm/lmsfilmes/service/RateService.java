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
        try {
            // Verificar se o filme já foi avaliado
            if (movieRepository.findByMovieIdAndNickname(ratingDTO.getMovieId(), ratingDTO.getNickname()).isPresent()) {
                return new RateDTO(400, "Você já avaliou este filme.");
            }
    
            // Converter RateDTO em MovieModel e salvar no banco de dados
            MovieModel movieModel = ratingDTO.toModel();
            movieRepository.save(movieModel);
    
            return new RateDTO(200, "Filme avaliado com sucesso. Nota: " + ratingDTO.getRating());
        } catch (Exception e) {
            return new RateDTO(500, "Erro ao salvar avaliação: " + e.getMessage());
        }
    }

    /**
     * Recupera filmes avaliados por um usuário.
     * 
     * @param nickname Nome do usuário
     * @return DTO com a lista de filmes avaliados e o status da operação
     */
    public RateDTO ratedContent(String nickname) {
        try {
            List<MovieModel> result = movieRepository.findAllByNickname(nickname);
            if (!result.isEmpty()) {
                return new RateDTO(result, 200, "Filmes avaliados encontrados para o nickname: " + nickname);
            } else {
                return new RateDTO(404, "Nenhum filme avaliado encontrado para o nickname: " + nickname);
            }
        } catch (Exception e) {
            return new RateDTO(500, "Erro ao buscar filmes avaliados: " + e.getMessage());
        }
    }
    
    /**
     * Atualiza a avaliação de um filme existente.
     * 
     * @param ratingDTO DTO com informações de avaliação atualizada do filme
     * @return DTO atualizado com o status da operação
     */
    public RateDTO updateRate(RateDTO ratingDTO) {
        try {
            Optional<MovieModel> movieOptional = movieRepository.findByMovieIdAndNickname(ratingDTO.getMovieId(), ratingDTO.getNickname());
            if (movieOptional.isPresent()) {
                MovieModel movieModel = movieOptional.get();
                movieModel.setMyVote(ratingDTO.getRating());
                movieRepository.save(movieModel);
                return new RateDTO(200, "Filme atualizado com sucesso. Nova nota: " + ratingDTO.getRating());
            } else {
                return new RateDTO(404, "Filme não encontrado para atualização.");
            }
        } catch (Exception e) {
            return new RateDTO(500, "Erro ao atualizar avaliação: " + e.getMessage());
        }
    }

    /**
     * Avalia uma série e salva a avaliação no banco de dados.
     * 
     * @param ratingDTO DTO com informações de avaliação da série
     * @return DTO atualizado com o status da operação
     */
    public RateDTO ratingSeries(RateDTO ratingDTO) {
        try {
            if (serieRepository.findBySerieIdAndNickname(ratingDTO.getSerieId(), ratingDTO.getNickname()).isPresent()) {
                return new RateDTO(400, "Você já avaliou esta série.");
            }

            SerieModel serieModel = new SerieModel();
            serieModel.setName(ratingDTO.getName());
            serieModel.setSerieId(ratingDTO.getSerieId());
            serieModel.setMyVote(ratingDTO.getRating());
            serieModel.setNickname(ratingDTO.getNickname());
            serieModel.setPoster_path(ratingDTO.getPoster_path());

            // Salvar no banco de dados
            serieRepository.save(serieModel);
            return new RateDTO(200, "Série avaliada com sucesso. Nota: " + ratingDTO.getRating());

        } catch (Exception e) {
            return new RateDTO(500, "Erro ao salvar avaliação: " + e.getMessage());
        }
    }

    /**
     * Recupera todas as séries avaliadas por um usuário.
     * 
     * @param nickname Nome do usuário
     * @return DTO com a lista de séries avaliadas e o status da operação
     */
    public RateDTO searchRatedSeries(String nickname) {
        try {
            List<SerieModel> result = serieRepository.findAllByNickname(nickname);
            if (!result.isEmpty()) {
                return new RateDTO(200, "Séries avaliadas encontradas.", result);
            } else {
                return new RateDTO(404, "Nenhuma série avaliada encontrada.");
            }
        } catch (Exception e) {
            return new RateDTO(500, "Erro ao buscar séries avaliadas: " + e.getMessage());
        }
    }
    
    /**
     * Atualiza a avaliação de uma série existente.
     * 
     * @param ratingDTO DTO com informações de avaliação atualizada da série
     * @return DTO atualizado com o status da operação
     */
    public RateDTO updateRatingSeries(RateDTO ratingDTO) {
        try {
            Optional<SerieModel> serieOptional = serieRepository.findBySerieIdAndNickname(ratingDTO.getSerieId(), ratingDTO.getNickname());
            if (serieOptional.isPresent()) {
                SerieModel serieModel = serieOptional.get();
                serieModel.setMyVote(ratingDTO.getRating());
                serieRepository.save(serieModel);
                return new RateDTO(200, "Série atualizada com sucesso. Nova nota: " + ratingDTO.getRating());
            } else {
                return new RateDTO(404, "Série não encontrada para atualização.");
            }
        } catch (Exception e) {
            return new RateDTO(500, "Erro ao atualizar avaliação: " + e.getMessage());
        }
    }
}