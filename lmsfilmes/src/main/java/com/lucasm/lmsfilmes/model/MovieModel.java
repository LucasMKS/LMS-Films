package com.lucasm.lmsfilmes.model;

import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Modelo de dados para filmes.
 */
@Entity
@Table(name = "movies")
@Data
public class MovieModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "movie_id")
    private String movieId;

    private String myVote;

    private String nickname;

    private String poster_path;

    @Temporal(TemporalType.DATE)
    private Date created_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = new Date();
    }
}
