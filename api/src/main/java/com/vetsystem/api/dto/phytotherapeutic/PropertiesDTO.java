package com.vetsystem.api.dto.phytotherapeutic;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropertiesDTO {
    
    private Long id;

    @NotBlank(message = "O nome da propriedade não pode estar em branco")
    private String name;

}
