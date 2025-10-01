package com.vetsystem.api.dto;

import java.util.List;
import lombok.Data;

public class VitalFunctionsDTO {
    
    // A resposta completa, que é uma lista de itens de funções vitais
    @Data
    public static class Response {
        private final List<Item> funcoesVitais;
    }

    // Representa uma única linha da sua tabela
    @Data
    public static class Item {
        private final String parametro; // Ex: "t °C", "FC - adultos"
        private final String caes;      // Ex: "37,5° - 39,3°"
        private final String gatos;     // Ex: "38,0° - 39,5°"
        private final String unidade;   // Ex: "°C", "bpm"
    }
}
