package com.vetsystem.api.dto;

import java.util.List;
import lombok.Data;
import lombok.RequiredArgsConstructor;

// DTO para a resposta completa, contendo os protocolos para cães e gatos
@Data
@RequiredArgsConstructor
public class VaccinationProtocolsDTO {
    private final List<ProtocolItem> caes;
    private final List<ProtocolItem> gatos;

    // DTO para uma única linha do protocolo (ex: "V8 - V10")
    @Data
    @RequiredArgsConstructor
    public static class ProtocolItem {
        private final String nome; // Ex: "V8 - V10"
        private final String idade1; // Coluna "45-60 Dias"
        private final String idade2; // Coluna "90 Dias"
        private final String idade3; // Coluna "16 semanas"
        private final String reforco; // Coluna "Reforço Anual"
    }
}