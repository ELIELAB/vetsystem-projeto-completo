package com.vetsystem.api.dto.pathology;

import lombok.*;
import jakarta.validation.constraints.NotBlank;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClassificationDTO {
    
    private Long id;

    @NotBlank(message = "O nome da classificação não pode estar em branco")
    private String name;

}
