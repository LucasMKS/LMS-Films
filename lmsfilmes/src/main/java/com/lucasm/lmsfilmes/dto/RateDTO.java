package com.lucasm.lmsfilmes.dto;

import java.util.List;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.lmsfilmes.model.MovieModel;
import com.lucasm.lmsfilmes.model.SerieModel;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RateDTO {
    
        private int statusCode;
        private String mensagem;
        private String error;
        private String title;
        private String name;
        private String rating;
        private String movieId;
        private String serieId;
        private String nickname;
        private String poster_path;
        private Date created_at;
        private MovieModel movieModel;
        private List<MovieModel> movieList;
        private SerieModel seriemodel;
        private List<SerieModel> serieList;

}
