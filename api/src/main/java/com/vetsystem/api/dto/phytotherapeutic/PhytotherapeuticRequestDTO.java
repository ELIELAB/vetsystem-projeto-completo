package com.vetsystem.api.dto.phytotherapeutic;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Este DTO agora representa UMA ÚNICA LINHA da sua planilha/tabela.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhytotherapeuticRequestDTO {

    // Removi o campo 'name' para simplificar, já que 'popularName' cumpre essa função no modelo plano.
    private String popularName;

    private String scientificName;
    
    private String preparationMethod;

    private String contraindication;
        
    private String imageUrl;
    
    // Removemos a lista de indicações e adicionamos os IDs diretamente.
    @NotNull(message = "O ID da propriedade é obrigatório")
    private Long propriedadeId;

    @NotNull(message = "O ID da doença tratada é obrigatório")
    private Long doencaTratadaId;
}