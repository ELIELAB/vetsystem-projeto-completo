package com.vetsystem.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vetsystem.api.dto.ConversionDTO.ConversionTablesResponse;
import com.vetsystem.api.service.ConversionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/conversao")
@RequiredArgsConstructor
public class ConversionController {
    private final ConversionService conversionService;

    @GetMapping("/tabelas")
    public ResponseEntity<ConversionTablesResponse> getTables() {
        return ResponseEntity.ok(conversionService.getConversionTables());
    }   
}
