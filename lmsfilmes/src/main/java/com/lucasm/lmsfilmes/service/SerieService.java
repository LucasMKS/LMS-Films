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
import java.util.stream.Collectors;
import java.net.URLEncoder;

/**
 * Serviço para buscar e manipular séries, incluindo favoritos.
 */
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

    /**
     * Busca séries com base na consulta fornecida.
     * 
     * @param query A consulta de pesquisa
     * @return Lista de séries que correspondem à consulta
     */
    public List<SeriesDTO> searchSeries(String query) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/search/tv?query=" + encodedQuery + "&include_adult=false&language=pt-BR"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                MovieSearchResponse searchResponse = objectMapper.readValue(response.body(), MovieSearchResponse.class);
                return searchResponse.getResults();
            } else {
                return List.of(new SeriesDTO("Série não encontrada"));
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            return List.of(new SeriesDTO("Série não encontrada: " + e.getMessage()));
        }
    }

    /**
     * Obtém os detalhes de uma série específica.
     * 
     * @param serieId O ID da série
     * @return Detalhes da série
     */
    public SeriesDTO getSeriesDetails(String serieId) {
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
                return new SeriesDTO("Detalhes da série não encontrados");
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            return new SeriesDTO("Detalhes da série não encontrados: " + e.getMessage());
        }
    }

    /**
     * Obtém séries populares para uma página específica.
     * 
     * @param page Número da página
     * @return Lista de séries populares
     */
    public List<SeriesDTO> seriePopular(int page) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/trending/tv/week?language=pt-BR&page=" + page))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                MovieSearchResponse searchResponse = objectMapper.readValue(response.body(), MovieSearchResponse.class);
                return searchResponse.getResults();
            } else {
                return List.of(new SeriesDTO("Séries populares não encontradas"));
            }
        } catch (IOException | InterruptedException | URISyntaxException e) {
            return List.of(new SeriesDTO("Séries populares não encontradas: " + e.getMessage()));
        }
    }

    /**
     * Obtém todas as séries favoritas de um usuário.
     * 
     * @param nickname O nickname do usuário
     * @return DTO com lista de séries favoritas
     */
    public FavoriteSerieDTO getAllSeriesFavorites(String nickname) {
        try {
            List<FavoriteSerieModel> result = favoriteSerieRepository.findAllByNickname(nickname);
            List<FavoriteSerieModel> favoriteSeries = result.stream()
                .filter(FavoriteSerieModel::isFavorite)
                .collect(Collectors.toList());

            if (!favoriteSeries.isEmpty()) {
                return new FavoriteSerieDTO(favoriteSeries, 200, "Séries favoritas encontradas");

            } else {
                return new FavoriteSerieDTO(null, 404, "Nenhuma série favoritada encontrada");
            }
        } catch (Exception e) {
            return new FavoriteSerieDTO(null, 500, "Erro ao buscar séries favoritas: " + e.getMessage());
        }
    }

    /**
     * Alterna o status de favorito de uma série.
     * 
     * @param favoriteDTO DTO com informações sobre a série favorita
     */
    public void toggleSerieFavorite(FavoriteSerieDTO favoriteDTO) {
        FavoriteSerieModel favoriteSerie = favoriteSerieRepository
            .findBySerieIdAndNickname(favoriteDTO.getSerieId(), favoriteDTO.getNickname())
            .orElse(new FavoriteSerieModel());

        favoriteSerie.setSerieId(favoriteDTO.getSerieId());
        favoriteSerie.setNickname(favoriteDTO.getNickname());
        favoriteSerie.setFavorite(favoriteDTO.isFavorite());
        favoriteSerie.setName(favoriteDTO.getName());
        favoriteSerieRepository.save(favoriteSerie);

    }

    /**
     * Verifica se uma série é favorita para um usuário.
     * 
     * @param serieId O ID da série
     * @param nickname O nickname do usuário
     * @return Verdadeiro se a série for favorita, falso caso contrário
     */
    public boolean isFavorite(String serieId, String nickname) {
        return favoriteSerieRepository
            .findBySerieIdAndNickname(serieId, nickname)
            .map(FavoriteSerieModel::isFavorite)
            .orElse(false);
    }

    private static class MovieSearchResponse {
        private List<SeriesDTO> results;

        public List<SeriesDTO> getResults() {
            return results;
        }
    }
}
