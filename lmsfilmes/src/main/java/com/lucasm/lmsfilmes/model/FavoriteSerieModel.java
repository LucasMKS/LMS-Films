package com.lucasm.lmsfilmes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "favorite_series")
@Data
public class FavoriteSerieModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "serie_id")
    private String serieId;

    @Column(name = "title")
    private String name;
    
    @Column(name = "nickname")
    private String nickname;

    @Column(name = "favorite")
    private boolean favorite;

    public boolean isFavorite() {
        return favorite;
    }
}
