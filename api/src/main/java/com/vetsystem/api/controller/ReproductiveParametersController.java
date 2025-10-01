package com.vetsystem.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vetsystem.api.dto.ReproductiveParametersDTO;
import com.vetsystem.api.service.ReproductiveParametersService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/parametros")
@RequiredArgsConstructor
public class ReproductiveParametersController {

    private final ReproductiveParametersService reproductiveParametersService;

     @GetMapping("/reprodutivos")
    public ResponseEntity<ReproductiveParametersDTO.Response> getParametrosReprodutivos() {
        return ResponseEntity.ok(reproductiveParametersService.getParametrosReprodutivos());
    }
}

