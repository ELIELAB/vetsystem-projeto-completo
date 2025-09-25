package com.vetsystem.api.controller.dayToDayCases;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vetsystem.api.dto.dayToDayCases.TreatmentProtocolsRequestDTO;
import com.vetsystem.api.dto.dayToDayCases.TreatmentProtocolsResponseDTO;
import com.vetsystem.api.service.dayToDayCases.TreatmentProtocolsService;
import jakarta.validation.Valid;
import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tratamentos/dia-a-dia")
public class TreatmentProtocolsController {
    
    private final TreatmentProtocolsService treatmentProtocolsService;

    //Listar classificações
    @GetMapping
    public ResponseEntity<List<TreatmentProtocolsResponseDTO>> findAll(){   
        return ResponseEntity.ok(treatmentProtocolsService.findAll());
    }
   
    //Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<TreatmentProtocolsResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(treatmentProtocolsService.findById(id));
    }
    //Criar nova 
    @PostMapping("/cadastro")
    public ResponseEntity<TreatmentProtocolsResponseDTO> create(@RequestBody @Valid TreatmentProtocolsRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(treatmentProtocolsService.create(requestDTO));
    }

    //inserir em lote
    @PostMapping("/lote")
    public ResponseEntity<List<TreatmentProtocolsResponseDTO>> createBatch(@RequestBody @Valid List<TreatmentProtocolsRequestDTO> requestDTOs) {
        return ResponseEntity.status(HttpStatus.CREATED).body(treatmentProtocolsService.createBatch(requestDTOs));
    }

    //Atualizar existente
    @PutMapping("/{id}")
    public ResponseEntity<TreatmentProtocolsResponseDTO> update(@PathVariable Long id, @RequestBody @Valid TreatmentProtocolsRequestDTO requestDTO){
        return ResponseEntity.ok(treatmentProtocolsService.update(id, requestDTO));
    }

    //Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        treatmentProtocolsService.delete(id);       
        return ResponseEntity.noContent().build();
    }
}
