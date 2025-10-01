package com.vetsystem.api.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.vetsystem.api.dto.ConversionDTO.ConversionItem;
import com.vetsystem.api.dto.ConversionDTO.ConversionTablesResponse;

@Service
public class ConversionService {

    public ConversionTablesResponse getConversionTables() {
        // Dados para a tabela de conversão de unidades
        List<ConversionItem> unidades = List.of(
            new ConversionItem("1 L", "1000 ml"),
            new ConversionItem("1 ml", "0,001 L"),
            new ConversionItem("1 UI", "0,01 MI"),
            new ConversionItem("0,1 ml", "10 UI"),
            new ConversionItem("1 ml", "1000 mg"),
            new ConversionItem("1 ml", "1000 Micrograma"),
            new ConversionItem("200 Micrograma", "0,2 mg"),
            new ConversionItem("1 Kg", "1000 g"),
            new ConversionItem("1 g", "1000 mg"),
            new ConversionItem("1 ml", "20 gotas")
        );

        // Dados para a tabela de medidas caseiras
        List<ConversionItem> medidas = List.of(
            new ConversionItem("Colher de Sopa", "15 ml"),
            new ConversionItem("Colher de Sobremesa", "10 ml"),
            new ConversionItem("Colher de Chá", "5 ml"),
            new ConversionItem("Colher de Café", "2 ml"),
            new ConversionItem("Copo", "150 ml"),
            new ConversionItem("Gota", "0,05 ml"),
            new ConversionItem("Litro", "1000 ml"),
            new ConversionItem("Xícara", "200 ml")
        );

        return new ConversionTablesResponse(unidades, medidas);
    }
}
