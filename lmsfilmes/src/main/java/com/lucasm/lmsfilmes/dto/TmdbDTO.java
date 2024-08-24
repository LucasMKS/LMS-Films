package com.lucasm.lmsfilmes.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.lmsfilmes.model.MovieModel;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbDTO {

    private int statusCode;
    private String error;
    private String mensagem;
    private String token;
    private String refreshToken;
    private String expirationTime;

    private String backdrop_path;
    private String homepage;
    private Long id;
    private String imdb_id;
    private String original_title;
    private String overview;
    private String poster_path;
    private String release_date;
    private int runtime;
    private String tagline;
    private String title;
    private double vote_average;
    private MovieModel movies;
    private List<TmdbDTO> results;
    private List<ProductionCompany> production_companies;
    private List<Genre> genres;

    @Data
    public static class Genre {
        private Long id;
        private String name;
    }

    @Data
    public static class ProductionCompany {
        private String name;
        private String origin_country;
    }

}
