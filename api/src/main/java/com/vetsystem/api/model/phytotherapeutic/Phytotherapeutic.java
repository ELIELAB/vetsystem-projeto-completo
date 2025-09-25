package com.vetsystem.api.model.phytotherapeutic;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_phytotherapeutic")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Phytotherapeutic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Campos de texto simples que se repetem
    private String popularName;
    private String scientificName;
    @Column(columnDefinition = "TEXT")
    private String preparationMethod;
    @Column(columnDefinition = "TEXT")
    private String contraindication;
    private String imageUrl;
    
    // Relação direta com Propriedade (Muitos Fitoterápicos para UMA Propriedade)
    @ManyToOne
    @JoinColumn(name = "properties_id", nullable = false)
    private Properties properties;

    // Relação direta com Doença (Muitos Fitoterápicos para UMA Doença)
    @ManyToOne
    @JoinColumn(name = "disease_treated_id", nullable = false)
    private DiseaseTreated diseaseTreated;
}