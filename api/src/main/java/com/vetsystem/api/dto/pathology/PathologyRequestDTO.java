package com.vetsystem.api.dto.pathology;

import lombok.*;
import com.vetsystem.api.model.Species;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PathologyRequestDTO {
    
    @NotBlank(message = "O nome da patologia não pode estar em branco")
    private String name;
    
    @NotNull
    private Species species;
    
    @NotBlank(message = "A etiologia não pode estar em branco")
    private String clinicalSigns;
    
    @NotBlank(message = "Os exames não podem estar em branco")
    private String exams;
    
    @NotBlank(message = "O tratamento não pode estar em branco")
    private String treatments;
    
    private String observations;
    
    @NotNull
    private Long classificationId;

}
