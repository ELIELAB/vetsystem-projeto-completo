package com.vetsystem.api.service.pathology;

import org.springframework.stereotype.Service;

import com.vetsystem.api.dto.pathology.ClassificationDTO;
import com.vetsystem.api.dto.pathology.PathologyRequestDTO;
import com.vetsystem.api.dto.pathology.PathologyResponseDTO;
import com.vetsystem.api.exception.ResourceNotFoundException;
import com.vetsystem.api.model.pathology.Classification;
import com.vetsystem.api.model.pathology.Pathology;
import com.vetsystem.api.repository.pathology.ClassificationRepository;
import com.vetsystem.api.repository.pathology.PathologyRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.*;

@RequiredArgsConstructor
@Service
public class PathologyService {
    private final PathologyRepository pathologyRepository;
    private final ClassificationRepository classificationRepository;

    //Listar todas as patologias
    @Transactional(readOnly = true) 
    public List<PathologyResponseDTO> findAll() {
        return pathologyRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    //Buscar patologia por ID
    @Transactional(readOnly = true)
    public PathologyResponseDTO findById(Long id) {
        return pathologyRepository.findById(id)
                .map(this::convertToResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Patologia não encontrada com id: " + id));
    }
    
    //Criar nova patologia
    @Transactional
    public PathologyResponseDTO create(PathologyRequestDTO requestDTO) {
        Classification classification = classificationRepository
            .findById(requestDTO.getClassificationId())
            .orElseThrow(() -> new ResourceNotFoundException("Classificação não encontrada com o ID: " + requestDTO.getClassificationId()));

        Pathology newPathology = new Pathology();
        copyDtoToEntity(requestDTO, newPathology, classification);

        return convertToResponseDTO(pathologyRepository.save(newPathology));
    }

    //inserir em lote
    /**
     * Cria uma lista de patologias em um único lote.
     * É mais eficiente do que chamar o método create várias vezes.
     * @param requestDTOs A lista de DTOs com os dados das patologias a serem criadas.
     * @return Uma lista com os DTOs das patologias salvas.
     */
    @Transactional
    public List<PathologyResponseDTO> createBatch(List<PathologyRequestDTO> requestDTOs) {
        
        // 1. Converte a lista de DTOs para uma lista de Entidades
        List<Pathology> pathologiesToSave = requestDTOs.stream()
            .map(dto -> {
                // Reutiliza a mesma lógica de busca e validação do método create()
                Classification classification = classificationRepository
                    .findById(dto.getClassificationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classificação não encontrada com o ID: " + dto.getClassificationId()));
                
                Pathology newPathology = new Pathology();
                // Reutiliza seu método auxiliar para mapear os campos
                copyDtoToEntity(dto, newPathology, classification);
                
                return newPathology;
            })
            .collect(Collectors.toList());

        // 2. Salva todas as novas entidades no banco de dados em uma única operação
        List<Pathology> savedPathologies = pathologyRepository.saveAll(pathologiesToSave);

        // 3. Converte a lista de entidades salvas de volta para uma lista de DTOs de resposta
        return savedPathologies.stream()
            .map(this::convertToResponseDTO) // Reutiliza seu DTO converter
            .collect(Collectors.toList());
    }

    //Atualizar patologia existente
    @Transactional
    public PathologyResponseDTO update(Long id, PathologyRequestDTO requestDTO) {
        Pathology pathology = pathologyRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patologia não encontrada com o ID: " + id));

        Classification classification = classificationRepository
            .findById(requestDTO.getClassificationId())
            .orElseThrow(() -> new ResourceNotFoundException("Classificação não encontrada com o ID: " + requestDTO.getClassificationId()));

        copyDtoToEntity(requestDTO, pathology, classification);

        return convertToResponseDTO(pathologyRepository.save(pathology));

    }

    //Deletar patologia
    public void delete(Long id) {
        if (!pathologyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patologia não encontrada com o ID: " + id);
        }
        pathologyRepository.deleteById(id);
    }

    /**
     * Método auxiliar para copiar os dados de um DTO de requisição para uma entidade.
     * Útil tanto para criação quanto para atualização.
     */
    private void copyDtoToEntity(PathologyRequestDTO dto, Pathology entity, Classification classification) {
        entity.setName(dto.getName());           
        entity.setSpecies(dto.getSpecies());    
        entity.setClinicalSigns(dto.getClinicalSigns()); 
        entity.setExams(dto.getExams());          
        entity.setTreatments(dto.getTreatments());     
        entity.setObservations(dto.getObservations()); 
        
        entity.setClassification(classification); // Associa a entidade Classification
    }

    /**
     * Converte uma entidade Pathology para o seu DTO de resposta.
     */
    // Em com.vetsystem.api.service.pathology.PathologyService.java (VERSÃO CORRIGIDA E SEGURA)

    private PathologyResponseDTO convertToResponseDTO(Pathology entity) {
        
        PathologyResponseDTO responseDTO = new PathologyResponseDTO();
        responseDTO.setId(entity.getId());
        responseDTO.setName(entity.getName());
        responseDTO.setSpecies(entity.getSpecies());
        responseDTO.setClinicalSigns(entity.getClinicalSigns());
        responseDTO.setExams(entity.getExams());
        responseDTO.setTreatments(entity.getTreatments());
        responseDTO.setObservations(entity.getObservations());

        // VERIFICAÇÃO DE NULO ANTES DE MAPEAMENTO
        if (entity.getClassification() != null) {
            ClassificationDTO classificationDTO = new ClassificationDTO(
                entity.getClassification().getId(),
                entity.getClassification().getName()
            );
            responseDTO.setClassification(classificationDTO);
        }
        // Se a classificação for nula, o campo no DTO permanecerá nulo, o que é o comportamento esperado.

        return responseDTO;
    }
}
