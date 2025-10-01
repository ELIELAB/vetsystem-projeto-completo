package com.vetsystem.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vetsystem.api.dto.CalculatorDTO.DosePorPesoRequest;
import com.vetsystem.api.dto.CalculatorDTO.DosePorPesoResponse;
import com.vetsystem.api.dto.CalculatorDTO.PercentualRequest;
import com.vetsystem.api.dto.CalculatorDTO.PercentualResponse;
import com.vetsystem.api.dto.CalculatorDTO.SuperficieCorporeaRequest;
import com.vetsystem.api.dto.CalculatorDTO.SuperficieCorporeaResponse;
import com.vetsystem.api.service.CalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/calculadora")
@RequiredArgsConstructor
public class CalculatorController {
    private final CalculatorService calculatorService;

    @PostMapping("/dose-por-peso")
    public ResponseEntity<DosePorPesoResponse> calcularDose (@RequestBody DosePorPesoRequest request){
        return ResponseEntity.ok(calculatorService.calcularDosePorPeso(request));
    }

    @PostMapping("/percentual")
    public ResponseEntity<PercentualResponse> converterPercentual(@RequestBody PercentualRequest request){
        return ResponseEntity.ok(calculatorService.converterPercentual(request));
    }

    @PostMapping("/superficie-corporea")
    public ResponseEntity<SuperficieCorporeaResponse> calcularSuperficieCorporea (@RequestBody SuperficieCorporeaRequest request){
        return ResponseEntity.ok(calculatorService.calcularSuperficieCorporea(request));
    }
}
