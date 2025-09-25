package com.vetsystem.api.controller.pathology;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vetsystem.api.dto.pathology.ClassificationDTO;
import com.vetsystem.api.service.pathology.ClassificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/classificacao-patologias")
public class ClassificationController {
    private final ClassificationService classificationService;

     //Listar todas as classificacoes   
    @GetMapping
    public ResponseEntity<List<ClassificationDTO>> findAll() {
        return ResponseEntity.ok(classificationService.findAll());
    }

    //Buscar classificacoes por ID  
   @GetMapping("/{id}")
    public ResponseEntity<ClassificationDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(classificationService.findById(id));
    }
 
    //Criar nova classificacoes   
    @PostMapping("/cadastro")
    public ResponseEntity<ClassificationDTO> create(@RequestBody @Valid ClassificationDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(classificationService.create(requestDTO));
    }        

    //Criar nova classificacoes em lote
    @PostMapping("/lote")
    public ResponseEntity<List<ClassificationDTO>> createBatch(@RequestBody @Valid List<ClassificationDTO> requestDTOs) {
        return  ResponseEntity.status(HttpStatus.CREATED).body(classificationService.createBatch(requestDTOs));
    }

    //Deletar classificacoes
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classificationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Atualizar classificacoes existente
    @PutMapping("/{id}")
    public ResponseEntity<ClassificationDTO> update(@PathVariable Long id, @RequestBody @Valid ClassificationDTO requestDTO) {
        return ResponseEntity.ok(classificationService.update(id, requestDTO));
    }
}
