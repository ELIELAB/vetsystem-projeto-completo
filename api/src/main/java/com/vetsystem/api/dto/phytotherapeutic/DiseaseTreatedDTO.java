package com.vetsystem.api.dto.phytotherapeutic;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseTreatedDTO {
    
    private Long id;

    @NotBlank(message = "O nome da doenca tratada não pode estar em branco")
    private String name;
}
