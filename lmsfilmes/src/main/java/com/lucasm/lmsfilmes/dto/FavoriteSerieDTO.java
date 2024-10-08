package com.lucasm.lmsfilmes.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.lmsfilmes.model.FavoriteSerieModel;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class FavoriteSerieDTO {

    private int statusCode;
    private String mensagem;
    private String error;
    
    private String serieId;
    private String name;
    private String nickname;
    private boolean favorite;
    private FavoriteSerieModel favoriteSerieModel;
    private List<FavoriteSerieModel> favoriteSerieList;

    // Construtor padrão
    public FavoriteSerieDTO() {}

    // Construtor com parâmetro para definir o status de favorito
    public FavoriteSerieDTO(boolean favorite) {
        this.favorite = favorite;
    }

    // Construtor com parâmetros para inicializar a lista de favoritos, status e mensagem
    public FavoriteSerieDTO(List<FavoriteSerieModel> favoriteSerieList, int statusCode, String mensagem) {
        this.favoriteSerieList = favoriteSerieList;
        this.statusCode = statusCode;
        this.mensagem = mensagem;
    }

    public boolean isFavorite() {
        return favorite;
    }
}
