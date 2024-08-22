package com.lucasm.lmsfilmes.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.lmsfilmes.model.MovieModel;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RateDTO {
    
        private int statusCode;
        private String mensagem;
        private String title;
        private String rating;
        private String movieId;
        private String nickname;
        private String poster_path;
        private MovieModel movieModel;
        private List<MovieModel> movieList;

}
