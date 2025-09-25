package com.vetsystem.api.dto.dayToDayCases;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentProtocolsRequestDTO {
    
    @NotBlank(message = "O tipo da doenca não pode estar em branco")
    private String type;
    private String prescription;
    private String information;
}
