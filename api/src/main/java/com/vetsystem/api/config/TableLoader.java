package com.vetsystem.api.config;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import lombok.*;
import java.io.*;
import org.slf4j.*;
import java.util.*;
import org.springframework.core.io.*;

@Component
@AllArgsConstructor
@Getter
public class TableLoader {
  
    private static final Logger logger = LoggerFactory.getLogger(TableLoader.class);

    private final NavigableMap<BigDecimal, BigDecimal> superficieCaes = new TreeMap<>();
    private final NavigableMap<BigDecimal, BigDecimal> superficieGatos = new TreeMap<>();

    private final ResourceLoader resourceLoader;

    @PostConstruct
    public void carregarDados() {
        
        logger.info("Iniciando carregamento das tabelas de superfície corpórea...");
        Resource resource = resourceLoader.getResource("classpath:corporeal-surface-table.csv");

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
             while ((line = reader.readLine()) != null) {
                String[] campos = line.split(",");
                if (campos.length == 3) {
                    try {
                        String especie = campos[0].trim();
                        BigDecimal peso = new BigDecimal(campos[1].trim());
                        BigDecimal m2 = new BigDecimal(campos[2].trim());

                        if ("cao".equalsIgnoreCase(especie)) {
                            superficieCaes.put(peso, m2);
                        } else if ("gato".equalsIgnoreCase(especie)) {
                            superficieGatos.put(peso, m2);
                        }
                    
                        logger.info("Tabelas carregadas com sucesso: {} registros para cães e {} para gatos.", superficieCaes.size(), superficieGatos.size());
                    } catch (NumberFormatException e) {
                        logger.warn("Erro ao converter número na linha: '{}'. Pulando linha.", line);
                    }
                }
            }

        } catch (IOException e) {
            logger.error("FALHA AO CARREGAR ARQUIVO de tabelas de superfície corpórea! ", e);
        }

    }
}
