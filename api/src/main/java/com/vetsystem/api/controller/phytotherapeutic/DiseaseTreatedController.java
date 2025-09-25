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
import org.springframework.web.bind.annotation.RestController;

import com.vetsystem.api.dto.phytotherapeutic.DiseaseTreatedDTO;
import com.vetsystem.api.service.phytotherapeutic.DiseaseTreatedService;
import jakarta.validation.Valid;
import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/doencas-tratadas")
public class DiseaseTreatedController {
    private final DiseaseTreatedService diseaseTreatedService;

    //Listar todas as Doencas 
    @GetMapping
    public ResponseEntity<List<DiseaseTreatedDTO>> findAll() {
        return ResponseEntity.ok(diseaseTreatedService.findAll());
    }

    //Buscar Doencas por ID  
    @GetMapping("/{id}")
    public ResponseEntity<DiseaseTreatedDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(diseaseTreatedService.findById(id));
    }

    //Criar nova Doencas  
    @PostMapping("/cadastro")
    public ResponseEntity<DiseaseTreatedDTO> create(@RequestBody @Valid DiseaseTreatedDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(diseaseTreatedService.create(requestDTO));
    }        

    //Criar nova Doencas em lote
    @PostMapping("/lote")
    public ResponseEntity<List<DiseaseTreatedDTO>>createBatch(@RequestBody @Valid List<DiseaseTreatedDTO> requestDTOs){
        return ResponseEntity.status(HttpStatus.CREATED).body(diseaseTreatedService.createBatch(requestDTOs));
    }

    //Deletar Doencas
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        diseaseTreatedService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Atualizar Doencas existente
    @PutMapping("/{id}")
    public ResponseEntity<DiseaseTreatedDTO> update(@PathVariable Long id, @RequestBody @Valid DiseaseTreatedDTO requestDTO) {
        return ResponseEntity.ok(diseaseTreatedService.update(id, requestDTO));
    }   
 
}
