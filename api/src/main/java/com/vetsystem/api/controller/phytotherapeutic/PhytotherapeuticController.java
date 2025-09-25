package com.vetsystem.api.controller.phytotherapeutic;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.vetsystem.api.dto.phytotherapeutic.PhytotherapeuticRequestDTO;
import com.vetsystem.api.dto.phytotherapeutic.PhytotherapeuticResponseDTO;
import com.vetsystem.api.service.phytotherapeutic.PhytotherapeuticService;
import jakarta.validation.Valid;
import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tratamento-fitoterapico")
public class PhytotherapeuticController {
    
    private final PhytotherapeuticService phytotherapeuticService;

    //Listar todas 
    @GetMapping
    public ResponseEntity<List<PhytotherapeuticResponseDTO>> findAll() {
        return ResponseEntity.ok(phytotherapeuticService.findAll());
    }

    //Buscar por ID  
    @GetMapping("/{id}")
    public ResponseEntity<PhytotherapeuticResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(phytotherapeuticService.findById(id));
    }
        
    // NOVO ENDPOINT DE BUSCA
    @GetMapping("/doencas")
    public ResponseEntity<List<PhytotherapeuticResponseDTO>> getByDisease(@RequestParam String name) {
        return ResponseEntity.ok(phytotherapeuticService.findByDisease(name));
    }

    //Criar nova  
    @PostMapping("/cadastro")
    public ResponseEntity<PhytotherapeuticResponseDTO> create(@RequestBody @Valid PhytotherapeuticRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phytotherapeuticService.create(requestDTO));
    }        

    //Criar nova em lote
    @PostMapping("/lote")
    public ResponseEntity<List<PhytotherapeuticResponseDTO>>createBatch(@RequestBody @Valid List<PhytotherapeuticRequestDTO> requestDTOs){
        return ResponseEntity.status(HttpStatus.CREATED).body(phytotherapeuticService.createBatch(requestDTOs));
    }

    //Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        phytotherapeuticService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Atualizar existente
    @PutMapping("/{id}")
    public ResponseEntity<PhytotherapeuticResponseDTO> update(@PathVariable Long id, @RequestBody @Valid PhytotherapeuticRequestDTO requestDTO) {
        return ResponseEntity.ok(phytotherapeuticService.update(id, requestDTO));
    }   
}
