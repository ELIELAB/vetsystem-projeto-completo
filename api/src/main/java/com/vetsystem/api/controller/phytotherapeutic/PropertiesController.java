package com.vetsystem.api.controller.phytotherapeutic;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vetsystem.api.dto.phytotherapeutic.PropertiesDTO;
import com.vetsystem.api.service.phytotherapeutic.PropertiesService;
import jakarta.validation.Valid;
import lombok.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@RequestMapping("/propriedades")
public class PropertiesController {
    private final PropertiesService propertiesService;

    //Listar todas 
    @GetMapping
    public ResponseEntity<List<PropertiesDTO>> findAll() {
        return ResponseEntity.ok(propertiesService.findAll());
    }

    //Buscar por ID  
    @GetMapping("/{id}")
    public ResponseEntity<PropertiesDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(propertiesService.findById(id));
    }

    //Criar nova  
    @PostMapping("/cadastro")
    public ResponseEntity<PropertiesDTO> create(@RequestBody @Valid PropertiesDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertiesService.create(requestDTO));
    }        

    //Criar nova em lote
    @PostMapping("/lote")
    public ResponseEntity<List<PropertiesDTO>>createBatch(@RequestBody @Valid List<PropertiesDTO> requestDTOs){
        return ResponseEntity.status(HttpStatus.CREATED).body(propertiesService.createBatch(requestDTOs));
    }

    //Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertiesService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Atualizar existente
    @PutMapping("/{id}")
    public ResponseEntity<PropertiesDTO> update(@PathVariable Long id, @RequestBody @Valid PropertiesDTO requestDTO) {
        return ResponseEntity.ok(propertiesService.update(id, requestDTO));
    }   
        
}
