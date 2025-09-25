package com.vetsystem.api.model.pathology;

import com.vetsystem.api.model.Species;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_pathology")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Pathology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Species species;

    @Column(nullable = false, columnDefinition = "TEXT")   
    private String clinicalSigns;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String exams;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String treatments;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String observations;

    @ManyToOne(fetch = FetchType.EAGER, optional = false) // Adicionando EAGER para ser explícito
    @JoinColumn(name = "classification_id", nullable = false) // CORREÇÃO: Usando o padrão snake_case
    private Classification classification;

}
