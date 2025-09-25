package com.vetsystem.api.model.pathology;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_classification")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Classification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

}
