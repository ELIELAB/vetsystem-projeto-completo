package com.vetsystem.api.controller;

import com.vetsystem.api.dto.VaccinationProtocolsDTO;
import com.vetsystem.api.service.VaccinationProtocolsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/protocolos")
@RequiredArgsConstructor
public class VaccinationProtocolsController {

    private final VaccinationProtocolsService vaccinationProtocolsService;

    @GetMapping("/vacinacao")
    public ResponseEntity<VaccinationProtocolsDTO> getProtocols() {
        return ResponseEntity.ok(vaccinationProtocolsService.getProtocols());
    }
}