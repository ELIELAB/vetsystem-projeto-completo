package com.vetsystem.api.service.dayToDayCases;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.vetsystem.api.dto.dayToDayCases.TreatmentProtocolsRequestDTO;
import com.vetsystem.api.dto.dayToDayCases.TreatmentProtocolsResponseDTO;
import com.vetsystem.api.exception.ResourceNotFoundException;
import com.vetsystem.api.model.dayToDayCases.TreatmentProtocols;
import com.vetsystem.api.repository.dayToDayCases.TreatmentProtocolsRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.*;

@Service
@AllArgsConstructor
@Getter
public class TreatmentProtocolsService {
    private final TreatmentProtocolsRepository repository;

    //Listar todas
    @Transactional(readOnly = true)
    public List<TreatmentProtocolsResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    //Buscar por ID
    @Transactional(readOnly = true)
    public TreatmentProtocolsResponseDTO findById(Long id) {
        return repository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Tratamento não encontrada com id: " + id));
    }

    //Criar nova
    @Transactional
    public TreatmentProtocolsResponseDTO create(TreatmentProtocolsRequestDTO dto) {
        TreatmentProtocols entity = new TreatmentProtocols();
        copyDtoToEntity(dto, entity);
        return convertToDTO(repository.save(entity));
    }

    //inserir em lote
    @Transactional
    public List<TreatmentProtocolsResponseDTO> createBatch(List<TreatmentProtocolsRequestDTO> dtos) {
        List<TreatmentProtocols> entities = dtos.stream()
                .map(dto -> {
                        TreatmentProtocols entity = new TreatmentProtocols();
                        copyDtoToEntity(dto, entity);
                        return entity;
                })
                .collect(Collectors.toList());  
        return repository.saveAll(entities).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
     
    }

    //Atualizar existente
    @Transactional
    public TreatmentProtocolsResponseDTO update(Long id, TreatmentProtocolsRequestDTO dto) {
       TreatmentProtocols entity = repository
            .findById(id)
            .orElseThrow(() -> new  ResourceNotFoundException("Tratamento não encontrado com id: " + id));

        copyDtoToEntity(dto, entity);
        return convertToDTO(repository.save(entity));
    }

    //Deletar 
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Tratamento não encontrado com o ID: " + id);
        }
        repository.deleteById(id);
    }

    // **MÉTODOS AUXILIARES**
    //Converter entidade para DTO
    private TreatmentProtocolsResponseDTO convertToDTO(TreatmentProtocols entity) {
        TreatmentProtocolsResponseDTO dto = new TreatmentProtocolsResponseDTO();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setPrescription(entity.getPrescription());
        dto.setInformation(entity.getInformation());
        return dto;
    }

    //Converter DTO para entidade
    private void copyDtoToEntity(TreatmentProtocolsRequestDTO dto, TreatmentProtocols entity) {
        entity.setType(dto.getType());
        entity.setPrescription(dto.getPrescription());
        entity.setInformation(dto.getInformation()); 
    }
}