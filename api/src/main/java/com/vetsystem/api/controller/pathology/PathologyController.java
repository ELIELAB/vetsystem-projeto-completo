package com.vetsystem.api.controller.pathology;

import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vetsystem.api.dto.pathology.PathologyRequestDTO;
import com.vetsystem.api.dto.pathology.PathologyResponseDTO;
import com.vetsystem.api.service.pathology.PathologyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RequiredArgsConstructor
@RestController
@RequestMapping("/patologias")  
public class PathologyController {
    private final PathologyService pathologyService;

    //Listar todas as patologias   
    @GetMapping
    public ResponseEntity<List<PathologyResponseDTO>> findAll() {
        return ResponseEntity.ok(pathologyService.findAll());
    }

    //Buscar patologia por ID  
   @GetMapping("/{id}")
    public ResponseEntity<PathologyResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(pathologyService.findById(id));
    }
 
    //Criar nova patologia   
    @PostMapping("/cadastro")
    public ResponseEntity<PathologyResponseDTO> create(@RequestBody @Valid PathologyRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pathologyService.create(requestDTO));
    }        

    //Criar nova patologia em lote
    @PostMapping("/lote")
    public ResponseEntity<List<PathologyResponseDTO>> createBatch(@RequestBody @Valid List<PathologyRequestDTO> requestDTOs) {
        return  ResponseEntity.status(HttpStatus.CREATED).body(pathologyService.createBatch(requestDTOs));
    }

    //Deletar patologia
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pathologyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Atualizar patologia existente
    @PutMapping("/{id}")
    public ResponseEntity<PathologyResponseDTO> update(@PathVariable Long id, @RequestBody @Valid PathologyRequestDTO requestDTO) {
        return ResponseEntity.ok(pathologyService.update(id, requestDTO));
    }
}
