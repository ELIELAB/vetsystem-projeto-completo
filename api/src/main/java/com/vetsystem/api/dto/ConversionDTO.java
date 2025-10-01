package com.vetsystem.api.dto;

import java.util.List;
import lombok.Data;

public class ConversionDTO {

    @Data
    public static class ConversionTablesResponse {
        private final List<ConversionItem> unidades;
        private final List<ConversionItem> medidas;
    }

    @Data
    public static class ConversionItem {
        private final String de;
        private final String para;
    }
}
