package com.lucasm.lmsfilmes.model;

import jakarta.persistence.*;
import lombok.Data;

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
}
