package com.vetsystem.api.dto.phytotherapeutic;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IndicationResponseDTO {
    
    private Long id;
    private PropertiesDTO properties;
    private DiseaseTreatedDTO diseaseTreated;
}