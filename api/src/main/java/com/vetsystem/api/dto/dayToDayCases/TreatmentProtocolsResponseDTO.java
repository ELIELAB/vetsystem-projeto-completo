package com.vetsystem.api.dto.dayToDayCases;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentProtocolsResponseDTO {
    
    private Long id;
    private String type;
    private String prescription;
    private String information;
}

