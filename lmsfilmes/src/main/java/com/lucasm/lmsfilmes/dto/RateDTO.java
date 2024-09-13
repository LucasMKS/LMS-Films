package com.lucasm.lmsfilmes.dto;

import java.util.List;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.lmsfilmes.model.MovieModel;
import com.lucasm.lmsfilmes.model.SerieModel;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para transferir informações sobre avaliações de filmes e séries.
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RateDTO {

    private int statusCode;          // Código de status da operação
    private String mensagem;         // Mensagem da operação
    private String error;            // Mensagem de erro, se houver
    private String title;            // Título do filme
    private String name;             // Nome da série
    private String rating;           // Nota atribuída
    private String movieId;          // ID do filme
    private String serieId;          // ID da série
    private String nickname;         // Nickname do usuário
    private String poster_path;      // Caminho do pôster
    private Date created_at;         // Data de criação
    private MovieModel movieModel;   // Modelo de filme
    private List<MovieModel> movieList; // Lista de filmes
    private SerieModel seriemodel;   // Modelo de série
    private List<SerieModel> serieList; // Lista de séries

    // Método para converter RateDTO em MovieModel
    public MovieModel toModel() {
        MovieModel movieModel = new MovieModel();
        movieModel.setTitle(this.title);
        movieModel.setMovieId(this.movieId);
        movieModel.setMyVote(this.rating);
        movieModel.setNickname(this.nickname);
        movieModel.setPoster_path(this.poster_path);
        return movieModel;
    }
}
