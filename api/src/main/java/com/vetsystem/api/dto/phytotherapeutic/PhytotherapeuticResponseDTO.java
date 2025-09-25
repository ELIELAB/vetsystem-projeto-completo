package com.vetsystem.api.dto.phytotherapeutic;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhytotherapeuticResponseDTO {
    
    private Long id;
    private String popularName;
    private String scientificName;
    private String preparationMethod;
    private String contraindication;
    private String imageUrl;
    
    // Em vez de listas, teremos apenas o nome da propriedade e da doença
    private String propertyName;
    private String diseaseTreatedName;

    // --- ADICIONADO: IDs para o formulário de edição ---
    private Long propertyId;
    private Long diseaseTreatedId;
}