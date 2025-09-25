package com.vetsystem.api.service.phytotherapeutic;

import com.vetsystem.api.dto.phytotherapeutic.PhytotherapeuticRequestDTO;
import com.vetsystem.api.dto.phytotherapeutic.PhytotherapeuticResponseDTO;
import com.vetsystem.api.exception.ResourceNotFoundException;
import com.vetsystem.api.model.phytotherapeutic.DiseaseTreated;
import com.vetsystem.api.model.phytotherapeutic.Phytotherapeutic;
import com.vetsystem.api.model.phytotherapeutic.Properties;
import com.vetsystem.api.repository.phytotherapeutic.DiseaseTreatedRepository;
import com.vetsystem.api.repository.phytotherapeutic.PhytotherapeuticRepository;
import com.vetsystem.api.repository.phytotherapeutic.PropertiesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhytotherapeuticService {

    private final PhytotherapeuticRepository phytotherapeuticRepository;
    private final PropertiesRepository propertiesRepository;
    private final DiseaseTreatedRepository diseaseTreatedRepository;

    // --- MÉTODOS DO CRUD (completos) ---

    @Transactional
    public PhytotherapeuticResponseDTO create(PhytotherapeuticRequestDTO requestDTO) {
        Phytotherapeutic newPhytotherapeutic = new Phytotherapeutic();
        copyDtoToEntity(requestDTO, newPhytotherapeutic);
        Phytotherapeutic savedEntity = phytotherapeuticRepository.save(newPhytotherapeutic);
        return convertToResponseDTO(savedEntity);
    }

    @Transactional
    public List<PhytotherapeuticResponseDTO> createBatch(List<PhytotherapeuticRequestDTO> requestDTOs) {
        List<Phytotherapeutic> entitiesToSave = requestDTOs.stream().map(dto -> {
            Phytotherapeutic newEntity = new Phytotherapeutic();
            copyDtoToEntity(dto, newEntity);
            return newEntity;
        }).collect(Collectors.toList());
        
        List<Phytotherapeutic> savedEntities = phytotherapeuticRepository.saveAll(entitiesToSave);
        
        return savedEntities.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhytotherapeuticResponseDTO> findAll() {
        return phytotherapeuticRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PhytotherapeuticResponseDTO findById(Long id) {
        Phytotherapeutic entity = phytotherapeuticRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fitoterápico não encontrado com ID: " + id));
        return convertToResponseDTO(entity);
    }
    
    @Transactional
    public PhytotherapeuticResponseDTO update(Long id, PhytotherapeuticRequestDTO requestDTO) {
        Phytotherapeutic entity = phytotherapeuticRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fitoterápico não encontrado com ID: " + id));
        copyDtoToEntity(requestDTO, entity);
        Phytotherapeutic updatedEntity = phytotherapeuticRepository.save(entity);
        return convertToResponseDTO(updatedEntity);
    }
    
    @Transactional
    public void delete(Long id) {
        if (!phytotherapeuticRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fitoterápico não encontrado com ID: " + id);
        }
        phytotherapeuticRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public List<PhytotherapeuticResponseDTO> findByDisease(String diseaseName) {
        List<Phytotherapeutic> plants = phytotherapeuticRepository.findByDiseaseTreated_NameIgnoreCase(diseaseName);
        if (plants.isEmpty()) {
            throw new ResourceNotFoundException("Nenhum tratamento encontrado para a doença: " + diseaseName);
        }
        return plants.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }


    // --- MÉTODOS AUXILIARES (sem alterações) ---

    private void copyDtoToEntity(PhytotherapeuticRequestDTO dto, Phytotherapeutic entity) {
        // Busca as entidades relacionadas pelos IDs do DTO
        Properties properties = propertiesRepository.findById(dto.getPropriedadeId())
            .orElseThrow(() -> new ResourceNotFoundException("Propriedade não encontrada com ID: " + dto.getPropriedadeId()));

        DiseaseTreated diseaseTreated = diseaseTreatedRepository.findById(dto.getDoencaTratadaId())
            .orElseThrow(() -> new ResourceNotFoundException("Doença tratada não encontrada com ID: " + dto.getDoencaTratadaId()));

        // Preenche a entidade com os dados do DTO
        entity.setPopularName(dto.getPopularName());
        entity.setScientificName(dto.getScientificName());
        entity.setPreparationMethod(dto.getPreparationMethod());     // <-- CORRIGIDO
        entity.setContraindication(dto.getContraindication());   // <-- CORRIGIDO
        entity.setImageUrl(dto.getImageUrl());
        entity.setProperties(properties);
        entity.setDiseaseTreated(diseaseTreated);
    }

    private PhytotherapeuticResponseDTO convertToResponseDTO(Phytotherapeutic entity) {
        PhytotherapeuticResponseDTO responseDTO = new PhytotherapeuticResponseDTO();
        responseDTO.setId(entity.getId());
        responseDTO.setPopularName(entity.getPopularName());
        responseDTO.setScientificName(entity.getScientificName());
        responseDTO.setPreparationMethod(entity.getPreparationMethod());
        responseDTO.setContraindication(entity.getContraindication());
        responseDTO.setImageUrl(entity.getImageUrl());
        
        if (entity.getProperties() != null) {
            responseDTO.setPropertyName(entity.getProperties().getName());
            // --- ADICIONADO ---
            responseDTO.setPropertyId(entity.getProperties().getId());
        }
        if (entity.getDiseaseTreated() != null) {
            responseDTO.setDiseaseTreatedName(entity.getDiseaseTreated().getName());
            // --- ADICIONADO ---
            responseDTO.setDiseaseTreatedId(entity.getDiseaseTreated().getId());
        }

        return responseDTO;
    }
}