package com.lucasm.lmsfilmes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lucasm.lmsfilmes.dto.FavoriteSerieDTO;
import com.lucasm.lmsfilmes.dto.SeriesDTO;
import com.lucasm.lmsfilmes.model.FavoriteSerieModel;
import com.lucasm.lmsfilmes.repository.FavoriteSerieRepository;

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
public class SerieService {

    @Autowired
    private FavoriteSerieRepository favoriteSerieRepository;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${tmdb.api.url}")
    private String tmdbApiUrl;

    @Value("${tmdb.api.key}")
    private String apiKey;

    public SerieService(ObjectMapper objectMapper) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = objectMapper;
    }

    public List<SeriesDTO> searchSeries(String query) {
        SeriesDTO serieDTO = new SeriesDTO();
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(
                            tmdbApiUrl + "/search/tv?query=" + encodedQuery + "&include_adult=true&language=pt-BR"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                MovieSearchResponse searchResponse = objectMapper.readValue(response.body(), MovieSearchResponse.class);
                return searchResponse.getResults();
            } else {
                serieDTO.setMensagem("Serie não encontrado");
                return List.of(serieDTO);
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
            serieDTO.setMensagem("Serie não encontrado: " + e.getMessage());
            return List.of(serieDTO);
        }
    }

    public SeriesDTO getSeriesDetails(String serieId) {
        SeriesDTO seriesDTO = new SeriesDTO();
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/tv/" + serieId + "?language=pt-BR"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                SeriesDTO serie = objectMapper.readValue(response.body(), SeriesDTO.class);
                serie.setMensagem("Detalhes da serie encontrado com sucesso");
                return serie;
            } else {
                seriesDTO.setMensagem("Detalhes da serie não encontrado");
                return seriesDTO;
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
            seriesDTO.setMensagem("Detalhes da serie não encontrado: " + e.getMessage());
            return seriesDTO;
        }
    }

    public List<SeriesDTO> seriePopular(int page) {
        SeriesDTO serieDTO = new SeriesDTO();
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/tv/popular?language=pt-BR&page=" + page))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                MovieSearchResponse searchResponse = objectMapper.readValue(response.body(), MovieSearchResponse.class);
                return searchResponse.getResults();
            } else {
                serieDTO.setMensagem("Series populares não encontrado");
                return List.of(serieDTO);
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
            serieDTO.setMensagem("Series populares não encontrado: " + e.getMessage());
            return List.of(serieDTO);
        }
    }

    public FavoriteSerieDTO getAllSeriesFavorites(String nickname) {
        FavoriteSerieDTO favSerieDTO = new FavoriteSerieDTO();
        try {
            List<FavoriteSerieModel> result = favoriteSerieRepository.findAllByNickname(nickname);
             List<FavoriteSerieModel> favoriteMovies = result.stream()
                .filter(FavoriteSerieModel::isFavorite)
                .collect(Collectors.toList());
            if (!favoriteMovies.isEmpty()) {
                favSerieDTO.setFavoriteSerieList(favoriteMovies);
                favSerieDTO.setStatusCode(200);
                favSerieDTO.setMensagem("Filmes favoritados encontrados");
            } else {
                favSerieDTO.setStatusCode(404);
                favSerieDTO.setError("Nenhum filme favoritado encontrado");
            }
        } catch (Exception e) {
            favSerieDTO.setStatusCode(500);
            favSerieDTO.setError("Erro ao buscar filmes favoritados: " + e.getMessage());
        }
        return favSerieDTO;
    }

    public void toggleSerieFavorite(FavoriteSerieDTO favoriteDTO) {
        Optional<FavoriteSerieModel> optionalFavorite = favoriteSerieRepository.findBySerieIdAndNickname(favoriteDTO.getSerieId(), favoriteDTO.getNickname());
        FavoriteSerieModel favoriteSerieMovie = optionalFavorite.orElseGet(() -> new FavoriteSerieModel());
        favoriteSerieMovie.setSerieId(favoriteDTO.getSerieId());
        favoriteSerieMovie.setNickname(favoriteDTO.getNickname());
        favoriteSerieMovie.setFavorite(favoriteDTO.isFavorite());
        favoriteSerieMovie.setName(favoriteDTO.getName());
        favoriteSerieRepository.save(favoriteSerieMovie);

    }

    public boolean isFavorite(String serieId, String nickname) {
        Optional<FavoriteSerieModel> optionalFavorite = favoriteSerieRepository.findBySerieIdAndNickname(serieId, nickname);
        return optionalFavorite.map(FavoriteSerieModel::isFavorite).orElse(false);
    }

    private static class MovieSearchResponse {
        private List<SeriesDTO> results;

        public List<SeriesDTO> getResults() {
            return results;
        }
    }
}
