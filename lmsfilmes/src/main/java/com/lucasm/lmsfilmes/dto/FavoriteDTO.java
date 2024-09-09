package com.lucasm.lmsfilmes.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.lmsfilmes.model.FavoriteModel;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class FavoriteDTO {

    private int statusCode;
    private String mensagem;
    private String error;
    
    private String movieId;
    private String title;
    private String nickname;
    private boolean favorite;
    private FavoriteModel favoriteModel;
    private List<FavoriteModel> favoriteList;

    // Construtor padrão
    public FavoriteDTO() {}

    // Construtor com parâmetro
    public FavoriteDTO(boolean favorite) {
        this.favorite = favorite;
    }

    public FavoriteDTO(int statusCode, String mensagem) {
        this.statusCode = statusCode;
        this.mensagem = mensagem;
    }

    public boolean isFavorite() {
        return favorite;
    }
}