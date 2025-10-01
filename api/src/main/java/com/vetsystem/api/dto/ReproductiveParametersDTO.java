package com.vetsystem.api.dto;

import lombok.Data;
import java.util.List;

public class ReproductiveParametersDTO {
    @Data
    public static class Response {
        private final List<Item> parametros;
    }

    @Data
    public static class Item {
        private final String especie;       // "Cão", "Gato", "Ave"
        private final String gestacao;      // "58-63"
        private final String cicloEstral;   // "6m"
        private final String cio;           // "9-14"
        private final String cioPosParto;   // "4-5m"
    }
}
