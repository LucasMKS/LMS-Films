package com.lucasm.lmsfilmes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lucasm.lmsfilmes.dto.TmdbDTO;
import com.lucasm.lmsfilmes.dto.FavoriteDTO;
import com.lucasm.lmsfilmes.model.FavoriteModel;
import com.lucasm.lmsfilmes.repository.FavoriteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.net.URLEncoder;

/**
 * Serviço para gerenciar filmes e favoritos.
 */
@Service
public class MovieService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final FavoriteRepository favoriteRepository;
    private final String tmdbApiUrl;
    private final String apiKey;

    public MovieService(ObjectMapper objectMapper, FavoriteRepository favoriteRepository, @Value("${tmdb.api.url}") String tmdbApiUrl, @Value("${tmdb.api.key}") String apiKey) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = objectMapper;
        this.favoriteRepository = favoriteRepository;
        this.tmdbApiUrl = tmdbApiUrl;
        this.apiKey = apiKey;
    }

    /**
     * Busca filmes com base em uma query.
     * 
     * @param query Termo de busca
     * @return Lista de filmes encontrados
     */
    public List<TmdbDTO> searchMovies(String query) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/search/movie?query=" + encodedQuery + "&include_adult=true&language=pt-BR"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                MovieSearchResponse searchResponse = objectMapper.readValue(response.body(), MovieSearchResponse.class);
                return searchResponse.getResults();
            } else {
                return List.of(new TmdbDTO(404, "Filme não encontrado"));
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            return List.of(new TmdbDTO(500, "Erro ao buscar filmes: " + e.getMessage()));
        }
    }

    /**
     * Busca detalhes de um filme específico.
     * 
     * @param movieId ID do filme
     * @return Detalhes do filme
     */
    public TmdbDTO getMoviesDetails(String movieId) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/movie/" + movieId + "?language=pt-BR"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                TmdbDTO movie = objectMapper.readValue(response.body(), TmdbDTO.class);
                movie.setMensagem("Detalhes encontrado com sucesso");
                return movie;
            } else {
                return new TmdbDTO(404, "Detalhes não encontrado");
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            return new TmdbDTO(500, "Erro ao buscar detalhes: " + e.getMessage());
        }
    }


    /**
     * Retorna os filmes populares em uma determinada página.
     * 
     * @param page Número da página
     * @return Lista de filmes populares
     */
    public List<TmdbDTO> moviePopular(int page) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/movie/popular?language=pt-BR&page=" + page))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                MovieSearchResponse searchResponse = objectMapper.readValue(response.body(), MovieSearchResponse.class);
                return searchResponse.getResults();
            } else {
                return List.of(new TmdbDTO(404, "Detalhes não encontrado"));
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            return List.of(new TmdbDTO(500, "Erro ao buscar filmes populares: " + e.getMessage()));
        }
    }

    /**
     * Retorna todos os filmes favoritados por um usuário.
     * 
     * @param nickname Nickname do usuário
     * @return DTO com a lista de favoritos e o status da operação
     */
    public FavoriteDTO getAllFavorites(String nickname) {
        try {
            List<FavoriteModel> result = favoriteRepository.findAllByNickname(nickname);
            List<FavoriteModel> favoriteMovies = result.stream()
                    .filter(FavoriteModel::isFavorite)
                    .collect(Collectors.toList());
    
            if (!favoriteMovies.isEmpty()) {
                FavoriteDTO favoriteDTO = new FavoriteDTO();
                favoriteDTO.setFavoriteList(favoriteMovies);
                favoriteDTO.setStatusCode(200);
                favoriteDTO.setMensagem("Filmes favoritados encontrados");
                return favoriteDTO;
            } else {
                return new FavoriteDTO(404, "Nenhum filme favoritado encontrado");
            }
        } catch (Exception e) {
            return new FavoriteDTO(500, "Erro ao buscar filmes favoritados: " + e.getMessage());
        }
    }

    /**
     * Adiciona ou remove um filme dos favoritos.
     * 
     * @param favorite DTO com informações do filme e do usuário
     */
    public void toggleFavorite(FavoriteDTO favorite) {
        Optional<FavoriteModel> optionalFavorite = favoriteRepository.findByMovieIdAndNickname(favorite.getMovieId(), favorite.getNickname());
        FavoriteModel favoriteMovie = optionalFavorite.orElseGet(() -> new FavoriteModel());
        favoriteMovie.setMovieId(favorite.getMovieId());
        favoriteMovie.setNickname(favorite.getNickname());
        favoriteMovie.setFavorite(favorite.isFavorite());
        favoriteMovie.setTitle(favorite.getTitle());
        favoriteRepository.save(favoriteMovie);

    }

     /**
     * Verifica se um filme é favoritado por um usuário.
     * 
     * @param movieId ID do filme
     * @param nickname Nickname do usuário
     * @return true se o filme for favoritado, false caso contrário
     */
    public boolean isFavorite(String movieId, String nickname) {
        Optional<FavoriteModel> optionalFavorite = favoriteRepository.findByMovieIdAndNickname(movieId, nickname);
        return optionalFavorite.map(FavoriteModel::isFavorite).orElse(false);
    }

    /**
     * Classe auxiliar para processar a resposta da pesquisa de filmes.
     */
    private static class MovieSearchResponse {
        private List<TmdbDTO> results;

        public List<TmdbDTO> getResults() {
            return results;
        }
    }
}
