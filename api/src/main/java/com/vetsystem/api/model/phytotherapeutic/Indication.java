package com.vetsystem.api.model.phytotherapeutic;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tb_indication")
public class Indication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ligação com a planta (Muitas indicações pertencem a UMA planta)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phytotherapeutic_id", nullable = false)
    private Phytotherapeutic phytotherapeutic;

    // Ligação com a propriedade (Muitas indicações podem ter a MESMA propriedade)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "properties_id", nullable = false)
    private Properties properties;

    // Ligação com a doença tratada (Muitas indicações podem tratar a MESMA doença)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disease_treated_id", nullable = false)
    private DiseaseTreated diseaseTreated;

}
