package com.lucasm.lmsfilmes.model;

import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Modelo de dados para séries.
 */
@Entity
@Table(name = "series")
@Data
public class SerieModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "serie_id")
    private String serieId;

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
