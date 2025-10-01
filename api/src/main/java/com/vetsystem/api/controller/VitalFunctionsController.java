package com.vetsystem.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vetsystem.api.dto.VitalFunctionsDTO;
import com.vetsystem.api.service.VitalFunctionsService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/parametros")
@RequiredArgsConstructor
public class VitalFunctionsController {
    private final VitalFunctionsService vitalFunctionsService;

    @GetMapping("/funcoes-vitais")
    public ResponseEntity<VitalFunctionsDTO.Response> getFuncoesVitais() {
        return ResponseEntity.ok(vitalFunctionsService.getFuncoesVitais()); 
    }
}
