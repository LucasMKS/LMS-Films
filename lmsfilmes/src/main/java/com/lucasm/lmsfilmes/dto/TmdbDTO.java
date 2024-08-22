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

    private boolean adult;
    private String backdrop_path;
    private CollectionDetails belongs_to_collection;
    private int budget;
    private List<Genre> genres;
    private String homepage;
    private Long id;
    private String imdb_id;
    private List<String> origin_country;
    private String original_language;
    private String original_title;
    private String overview;
    private double popularity;
    private String poster_path;
    private List<ProductionCompany> production_companies;
    private List<ProductionCountry> production_countries;
    private String release_date;
    private long revenue;
    private int runtime;
    private List<SpokenLanguage> spoken_languages;
    private String status;
    private String tagline;
    private String title;
    private boolean video;
    private double vote_average;
    private int vote_count;
    private MovieModel movies;
    private List<TmdbDTO> results;

    @Data
    public static class CollectionDetails {
        private Long id;
        private String name;
        private String poster_path;
        private String backdrop_path;
    }

    @Data
    public static class Genre {
        private Long id;
        private String name;
    }

    @Data
    public static class ProductionCompany {
        private Long id;
        private String logo_path;
        private String name;
        private String origin_country;
    }

    @Data
    public static class ProductionCountry {
        private String iso_3166_1;
        private String name;
    }

    @Data
    public static class SpokenLanguage {
        private String english_name;
        private String iso_639_1;
        private String name;
    }
}
