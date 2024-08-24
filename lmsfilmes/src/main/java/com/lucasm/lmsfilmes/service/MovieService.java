package com.lucasm.lmsfilmes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lucasm.lmsfilmes.dto.RateDTO;
import com.lucasm.lmsfilmes.dto.TmdbDTO;
import com.lucasm.lmsfilmes.dto.FavoriteDTO;
import com.lucasm.lmsfilmes.model.FavoriteModel;
import com.lucasm.lmsfilmes.model.MovieModel;
import com.lucasm.lmsfilmes.repository.FavoriteRepository;
import com.lucasm.lmsfilmes.repository.MovieRepository;

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

@Service
public class MovieService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Value("${tmdb.api.url}")
    private String tmdbApiUrl;

    @Value("${tmdb.api.key}")
    private String apiKey;

    public MovieService(ObjectMapper objectMapper) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = objectMapper;
    }

    public List<TmdbDTO> searchMovies(String query) {
        TmdbDTO reqRes = new TmdbDTO();
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(
                            tmdbApiUrl + "/search/movie?query=" + encodedQuery + "&include_adult=false&language=pt-BR"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                MovieSearchResponse searchResponse = objectMapper.readValue(response.body(), MovieSearchResponse.class);
                return searchResponse.getResults();
            } else {
                // Handle non-200 responses
                reqRes.setMensagem("Detalhes não encontrado");
                return List.of(reqRes);
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
            reqRes.setMensagem("Detalhes não encontrado: " + e.getMessage());
            return List.of(reqRes);
        }
    }

    public TmdbDTO getMoviesDetails(String movieId) {
        TmdbDTO reqRes = new TmdbDTO();
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
                reqRes.setMensagem("Detalhes não encontrado");
                return reqRes;
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
            reqRes.setMensagem("Detalhes não encontrado: " + e.getMessage());
            return reqRes;
        }
    }

    public List<TmdbDTO> moviePopular(int page) {
        TmdbDTO reqRes = new TmdbDTO();
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
                reqRes.setMensagem("Detalhes não encontrado");
                return List.of(reqRes);
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
            reqRes.setMensagem("Detalhes não encontrado: " + e.getMessage());
            return List.of(reqRes);
        }
    }

    public FavoriteDTO getAllFavorites(String nickname) {
        FavoriteDTO reqDTO = new FavoriteDTO();
        try {
            List<FavoriteModel> result = favoriteRepository.findAllByNickname(nickname);
             List<FavoriteModel> favoriteMovies = result.stream()
                .filter(FavoriteModel::isFavorite)
                .collect(Collectors.toList());
            if (!favoriteMovies.isEmpty()) {
                reqDTO.setFavoriteList(favoriteMovies);
                reqDTO.setStatusCode(200);
                reqDTO.setMensagem("Filmes favoritados encontrados");
            } else {
                reqDTO.setStatusCode(404);
                reqDTO.setError("Nenhum filme favoritado encontrado");
            }
        } catch (Exception e) {
            reqDTO.setStatusCode(500);
            reqDTO.setError("Erro ao buscar filmes favoritados: " + e.getMessage());
        }
        return reqDTO;
    }

    public void toggleFavorite(FavoriteDTO favorite) {
        Optional<FavoriteModel> optionalFavorite = favoriteRepository.findByMovieIdAndNickname(favorite.getMovieId(), favorite.getNickname());
        FavoriteModel favoriteMovie = optionalFavorite.orElseGet(() -> new FavoriteModel());
        favoriteMovie.setMovieId(favorite.getMovieId());
        favoriteMovie.setNickname(favorite.getNickname());
        favoriteMovie.setFavorite(favorite.isFavorite());
        favoriteMovie.setTitle(favorite.getTitle());
        favoriteRepository.save(favoriteMovie);

    }

    public boolean isFavorite(String movieId, String nickname) {
        Optional<FavoriteModel> optionalFavorite = favoriteRepository.findByMovieIdAndNickname(movieId, nickname);
        return optionalFavorite.map(FavoriteModel::isFavorite).orElse(false);
    }

    private static class MovieSearchResponse {
        private List<TmdbDTO> results;

        public List<TmdbDTO> getResults() {
            return results;
        }
    }
}
