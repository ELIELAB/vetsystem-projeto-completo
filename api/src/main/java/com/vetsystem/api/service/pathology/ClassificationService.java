package com.vetsystem.api.service.pathology;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.vetsystem.api.dto.pathology.ClassificationDTO;
import com.vetsystem.api.exception.ResourceNotFoundException;
import com.vetsystem.api.model.pathology.Classification;
import com.vetsystem.api.repository.pathology.ClassificationRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.*;

@AllArgsConstructor
@Service
public class ClassificationService {
    private final ClassificationRepository classificationRepository;

    //Listar todas as classificações
    @Transactional(readOnly = true)
    public List<ClassificationDTO> findAll() {
        return classificationRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    //Buscar classificação por ID
    @Transactional(readOnly = true)
    public ClassificationDTO findById(Long id) {
        return classificationRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Classificação não encontrada com id: " + id));
    }

    //Criar nova classificação
    @Transactional
    public ClassificationDTO create(ClassificationDTO classificationDTO) {
        Classification classification = new Classification();
        classification.setName(classificationDTO.getName());
       
        return convertToDTO(classificationRepository.save(classification));
    }
    
    //inserir em lote
    @Transactional
    public List<ClassificationDTO> createBatch(List<ClassificationDTO> produtosDTOs){
        
        // 1. Converte a lista de DTOs para uma lista de Entidades DENTRO do stream
        List<Classification> produtosEntidades = produtosDTOs.stream().map(dto -> {
                Classification classification = new Classification();
                classification.setName(dto.getName());
                return classification;
            }).collect(Collectors.toList());

        // 3. Converte as entidades salvas de volta para DTOs e retorna
        return classificationRepository.saveAll(produtosEntidades).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    //Atualizar classificação existente
    @Transactional
    public ClassificationDTO update(Long id, ClassificationDTO classificationDTO) {
        Classification idExistente = classificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Classificação não encontrada com id: " + id));
            
        idExistente.setName(classificationDTO.getName());

        return convertToDTO(classificationRepository.save(idExistente));
    }

    //Deletar classificação
    @Transactional
    public void delete(Long id) {
        if (!classificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Classificacão não encontrada com o ID: " + id);
        }
        classificationRepository.deleteById(id);
    }

    // **MÉTODOS AUXILIARES**

    //Converter entidade para DTO
    private ClassificationDTO convertToDTO(Classification classification) {
        return new ClassificationDTO(classification.getId(), classification.getName());
    }
}
