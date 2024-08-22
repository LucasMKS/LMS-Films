package com.lucasm.lmsfilmes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lucasm.lmsfilmes.dto.TmdbDTO;

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
import java.net.URLEncoder;

@Service
public class MovieService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    private TmdbDTO reqRes = new TmdbDTO();

    @Value("${tmdb.api.url}")
    private String tmdbApiUrl;

    @Value("${tmdb.api.key}")
    private String apiKey;

    public MovieService(ObjectMapper objectMapper) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = objectMapper;
    }

    public List<TmdbDTO> searchMovies(String query) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/search/movie?query=" + encodedQuery  + "&include_adult=false&language=pt-BR"))
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
    
    public List<TmdbDTO> moviePopular() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(tmdbApiUrl + "/movie/popular?language=pt-BR"))
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


    private static class MovieSearchResponse {
        private List<TmdbDTO> results;

        public List<TmdbDTO> getResults() {
            return results;
        }
    }
}
