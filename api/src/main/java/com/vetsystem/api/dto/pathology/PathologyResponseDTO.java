// no arquivo PathologyResponseDTO.java

package com.vetsystem.api.dto.pathology;

import lombok.*;
import com.vetsystem.api.model.Species;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PathologyResponseDTO {
    
    private Long id;
    private String name;
    private Species species;
    private String clinicalSigns;
    private String exams;
    private String treatments;
    private String observations;
    
    // --- CORREÇÃO APLICADA AQUI ---
    // O nome da variável deve ser 'classification', pois seu tipo é ClassificationDTO
    private ClassificationDTO classification; 
}