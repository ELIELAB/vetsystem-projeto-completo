package com.vetsystem.api.service;

import java.math.*;
import java.util.NavigableMap;
import org.springframework.stereotype.Service;
import com.vetsystem.api.config.TableLoader;
import com.vetsystem.api.dto.CalculatorDTO.DosePorPesoRequest;
import com.vetsystem.api.dto.CalculatorDTO.DosePorPesoResponse;
import com.vetsystem.api.dto.CalculatorDTO.PercentualRequest;
import com.vetsystem.api.dto.CalculatorDTO.PercentualResponse;
import com.vetsystem.api.dto.CalculatorDTO.SuperficieCorporeaRequest;
import com.vetsystem.api.dto.CalculatorDTO.SuperficieCorporeaResponse;
import com.vetsystem.api.dto.CalculatorDTO.FluidoterapiaRequest;
import com.vetsystem.api.dto.CalculatorDTO.FluidoterapiaResponse;

import lombok.*;

@Service
@AllArgsConstructor
public class CalculatorService {
    
    private final TableLoader tableLoader;

    public DosePorPesoResponse calcularDosePorPeso(DosePorPesoRequest request){

        if(request.getConcentracao() == null || request.getConcentracao().compareTo(BigDecimal.ZERO) == 0){
            throw new IllegalArgumentException("A concentração do medicamento não pode ser nula ou zero.");
        }
        BigDecimal doseTotalMg = request.getPeso().multiply(request.getDose());
        BigDecimal resultado = doseTotalMg.divide(request.getConcentracao(), 3, RoundingMode.HALF_UP);
        return new DosePorPesoResponse(resultado, resultado);
    }

    public PercentualResponse converterPercentual(PercentualRequest request){
        return new PercentualResponse(request.getPercentual().multiply(new BigDecimal("10")));
    }

    public SuperficieCorporeaResponse calcularSuperficieCorporea(SuperficieCorporeaRequest request) {
        String especie = request.getEspecie();
        BigDecimal peso = request.getPeso();

        // 1. Validação inicial dos dados de entrada
        if (especie == null || especie.trim().isEmpty() || peso == null) {
            throw new IllegalArgumentException("Espécie e peso são obrigatórios.");
        }

        // 2. Seleciona a tabela correta (cães ou gatos) com base na espécie
        NavigableMap<BigDecimal, BigDecimal> tabela;
        if ("cao".equalsIgnoreCase(especie)) {
            tabela = tableLoader.getSuperficieCaes();
        } else if ("gato".equalsIgnoreCase(especie)) {
            tabela = tableLoader.getSuperficieGatos();
        } else {
            // Se a espécie for inválida, lança uma exceção que será tratada pelo GlobalExceptionHandler
            throw new IllegalArgumentException("Espécie inválida. Use 'cao' ou 'gato'.");
        }

        // 3. Valida se a tabela de dados foi carregada corretamente
        if (tabela.isEmpty()) {
            // Este erro indica um problema no servidor (CSV vazio ou não encontrado)
            throw new IllegalStateException("A tabela de dados para " + especie + " não foi carregada ou está vazia.");
        }

        // 4. Lógica para encontrar o valor mais próximo na tabela
        // Encontra o maior peso na tabela que é menor ou igual ao peso do animal ("piso")
        BigDecimal piso = tabela.floorKey(peso);
        // Encontra o menor peso na tabela que é maior ou equal ao peso do animal ("teto")
        BigDecimal teto = tabela.ceilingKey(peso);

        // Trata casos onde o peso do animal está fora do intervalo da tabela
        if (piso == null) piso = teto; // Se for menor que o mínimo, use o mínimo
        if (teto == null) teto = piso; // Se for maior que o máximo, use o máximo

        // 5. Determina qual dos valores (piso ou teto) está mais perto do peso real
        BigDecimal m2;
        BigDecimal diffPiso = peso.subtract(piso).abs(); // Distância até o piso
        BigDecimal diffTeto = teto.subtract(peso).abs(); // Distância até o teto

        if (diffPiso.compareTo(diffTeto) <= 0) {
            // Se a distância para o piso for menor ou igual, use o valor do piso
            m2 = tabela.get(piso);
        } else {
            // Caso contrário, use o valor do teto
            m2 = tabela.get(teto);
        }

        // 6. Retorna a resposta encapsulada no DTO
        return new SuperficieCorporeaResponse(m2);
    }

    public FluidoterapiaResponse calcularFluidoterapia(FluidoterapiaRequest request) {
        BigDecimal peso = request.getPeso();
        BigDecimal percentualDesidratacao = new BigDecimal(request.getPercentualDesidratacao());
        BigDecimal taxaManutencao = new BigDecimal(request.getTaxaManutencao());
        BigDecimal taxaPerdaAdicional = new BigDecimal(request.getTaxaPerdaAdicional());

        // 1. Cálculo de Reposição (Desidratação)
        // Formula: Peso (kg) * % Desidratação * 10
        BigDecimal volumeReposicao = peso.multiply(percentualDesidratacao).multiply(new BigDecimal("10"));

        // 2. Cálculo de Manutenção
        // Formula: Peso (kg) * Taxa de Manutenção (ml/kg/dia)
        BigDecimal volumeManutencao = peso.multiply(taxaManutencao);

        // 3. Cálculo de Perdas Adicionais
        // Formula: Peso (kg) * Taxa de Perda (ml/kg/dia)
        BigDecimal volumePerdaAdicional = peso.multiply(taxaPerdaAdicional);

        // 4. Volume Total em 24h
        BigDecimal volumeTotal24h = volumeReposicao.add(volumeManutencao).add(volumePerdaAdicional);

        // 5. Cálculos de Gotejamento
        BigDecimal mlPorHora = volumeTotal24h.divide(new BigDecimal("24"), 2, RoundingMode.HALF_UP);
        BigDecimal mlPorMinuto = mlPorHora.divide(new BigDecimal("60"), 2, RoundingMode.HALF_UP);
        
        BigDecimal gotasPorMinutoMicro = mlPorMinuto.multiply(new BigDecimal("60"));
        BigDecimal segundosPorGotaMicro = BigDecimal.ZERO;
        if (gotasPorMinutoMicro.compareTo(BigDecimal.ZERO) > 0) {
            segundosPorGotaMicro = new BigDecimal("60").divide(gotasPorMinutoMicro, 2, RoundingMode.HALF_UP);
        }

        BigDecimal gotasPorMinutoMacro = mlPorMinuto.multiply(new BigDecimal("20"));
        BigDecimal segundosPorGotaMacro = BigDecimal.ZERO;
        if (gotasPorMinutoMacro.compareTo(BigDecimal.ZERO) > 0) {
            segundosPorGotaMacro = new BigDecimal("60").divide(gotasPorMinutoMacro, 2, RoundingMode.HALF_UP);
        }

        return new FluidoterapiaResponse(
            volumeReposicao, volumeManutencao, volumePerdaAdicional, volumeTotal24h,
            mlPorHora, gotasPorMinutoMicro, segundosPorGotaMicro,
            gotasPorMinutoMacro, segundosPorGotaMacro
        );
    }
}
