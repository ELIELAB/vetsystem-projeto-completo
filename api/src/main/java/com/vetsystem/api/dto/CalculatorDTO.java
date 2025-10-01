package com.vetsystem.api.dto;

import lombok.*;
import java.math.BigDecimal;

public final class CalculatorDTO {

    // --- DTOs para Cálculo de Dose por Peso ---
    @Data
    public static class DosePorPesoRequest {
        private BigDecimal peso;
        private BigDecimal dose;
        private BigDecimal concentracao;
    }

    @Data
    public static class DosePorPesoResponse {
        private final BigDecimal resultadoLiquido;
        private final BigDecimal resultadoComprimido;
    }

    // --- DTOs para Conversor de Percentual ---
    @Data
    public static class PercentualRequest {
        private BigDecimal percentual;
    }

    @Data
    public static class PercentualResponse {
        private final BigDecimal mgPorMl;
    }

    // --- DTOs para Superfície Corpórea ---
    @Data
    public static class SuperficieCorporeaRequest {
        private BigDecimal peso;
        private String especie; // "cao" ou "gato"
    }

    @Data
    public static class SuperficieCorporeaResponse {
        private final BigDecimal m2;
    }
}