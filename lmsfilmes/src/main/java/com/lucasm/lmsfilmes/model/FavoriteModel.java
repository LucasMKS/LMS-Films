package com.lucasm.lmsfilmes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * Modelo de dados para filmes favoritos.
 */
@Entity
@Table(name = "favorite_movies")
@Data
public class FavoriteModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "movie_id")
    private String movieId;

    @Column(name = "title")
    private String title;
    
    @Column(name = "nickname")
    private String nickname;

    @Column(name = "favorite")
    private boolean favorite;

    public boolean isFavorite() {
        return favorite;
    }
}
