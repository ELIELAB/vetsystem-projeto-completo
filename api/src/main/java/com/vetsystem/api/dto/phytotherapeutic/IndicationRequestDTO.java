package com.vetsystem.api.dto.phytotherapeutic;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IndicationRequestDTO {
    
    @NotNull(message = "O ID da propriedade não pode ser nulo")
    private Long propertiesId;
    
    @NotNull(message = "O ID da doença tratada não pode ser nulo")
    private Long diseaseTreatedId;
}