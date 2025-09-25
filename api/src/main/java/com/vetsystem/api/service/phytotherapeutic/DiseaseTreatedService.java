package com.vetsystem.api.service.phytotherapeutic;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vetsystem.api.dto.phytotherapeutic.DiseaseTreatedDTO;
import com.vetsystem.api.exception.ResourceNotFoundException;
import com.vetsystem.api.model.phytotherapeutic.DiseaseTreated;
import com.vetsystem.api.repository.phytotherapeutic.DiseaseTreatedRepository;
import lombok.*;

@Service
@AllArgsConstructor

public class DiseaseTreatedService {
    private final DiseaseTreatedRepository diseaseTreatedRepository;

    //Listar todas as Doencas
    @Transactional(readOnly = true)
    public List<DiseaseTreatedDTO> findAll() {
        return diseaseTreatedRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    //Buscar Doencas por ID
    @Transactional(readOnly = true)
    public DiseaseTreatedDTO findById(Long id) {
        return diseaseTreatedRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Doenca tratada não encontrada com id: " + id));    
    }

    //Criar nova Doencas
    @Transactional
    public DiseaseTreatedDTO create(DiseaseTreatedDTO diseaseTreatedDTO) {
        DiseaseTreated diseaseTreated = new DiseaseTreated();
        diseaseTreated.setName(diseaseTreatedDTO.getName());
        return convertToDTO(diseaseTreatedRepository.save(diseaseTreated));         
    }

    //inserir Doencas em lote
    @Transactional
    public List<DiseaseTreatedDTO> createBatch(List<DiseaseTreatedDTO> diseaseTreatedDTO){
        
        // 1. Converte a lista de DTOs para uma lista de Entidades DENTRO do stream
        List<DiseaseTreated> produtosEntidades = diseaseTreatedDTO.stream().map(dto -> {
                DiseaseTreated diseaseTreated = new DiseaseTreated();
                diseaseTreated.setName(dto.getName());
                return diseaseTreated;
            }).collect(Collectors.toList());

        // 3. Converte as entidades salvas de volta para DTOs e retorna
        return diseaseTreatedRepository.saveAll(produtosEntidades).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    //Atualizar Doencas existente
    public DiseaseTreatedDTO update(Long id, DiseaseTreatedDTO diseaseTreatedDTO) {
        DiseaseTreated idExistente = diseaseTreatedRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Doenca não encontrada com id: " + id));

        idExistente.setName(diseaseTreatedDTO.getName());

        return convertToDTO(diseaseTreatedRepository.save(idExistente));
    }

    //Deletar Doencas
    public void delete(Long id){
        if (!diseaseTreatedRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doenca não encontrada com o ID: " + id);
        }
        diseaseTreatedRepository.deleteById(id);
    }

    // **MÉTODOS AUXILIARES**

    //Converter entidade para DTO
    private DiseaseTreatedDTO convertToDTO(DiseaseTreated diseaseTreated) {
        return new DiseaseTreatedDTO(diseaseTreated.getId(), diseaseTreated.getName());
    }
}
