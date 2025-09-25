package com.vetsystem.api.model.dayToDayCases;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_treatment_protocols")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class TreatmentProtocols {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String type;
    @Column(columnDefinition = "TEXT")
    private String prescription;
    @Column(columnDefinition = "TEXT")
    private String information;
}
