package com.vetsystem.api.service.phytotherapeutic;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.vetsystem.api.dto.phytotherapeutic.PropertiesDTO;
import com.vetsystem.api.exception.ResourceNotFoundException;
import com.vetsystem.api.model.phytotherapeutic.Properties;
import com.vetsystem.api.repository.phytotherapeutic.PropertiesRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.*;

@Service
@AllArgsConstructor
public class PropertiesService {
    private final PropertiesRepository propertiesRepository;

    //Listar todas as propriedades
    @Transactional(readOnly = true)
    public List<PropertiesDTO> findAll(){
        return propertiesRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .toList();
    }

    //Buscar propriedade por ID
    @Transactional(readOnly = true)
    public PropertiesDTO findById(Long id){
        return propertiesRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Propriedade não encontrada com id: " + id));
    }
    
    //Criar nova propriedade
    @Transactional
    public PropertiesDTO create(PropertiesDTO propertiesDTO){

        Properties properties = new Properties();
        properties.setName(propertiesDTO.getName());
        
        return convertToDTO(propertiesRepository.save(properties));
    }
         
    //inserir propriedade em lote
    @Transactional
    public List<PropertiesDTO> createBatch(List<PropertiesDTO> propertiesDTO){
        
        // 1. Converte a lista de DTOs para uma lista de Entidades DENTRO do stream
        List<Properties> propertiesEntidades = propertiesDTO.stream()
            .map(dto -> {
                Properties properties = new Properties();
                properties.setName(dto.getName());
                return properties;
            })
            .collect(Collectors.toList());

        // 3. Converte as entidades salvas de volta para DTOs e retorna
        return propertiesRepository.saveAll(propertiesEntidades).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    //Atualizar propriedade existente
    @Transactional
    public PropertiesDTO update(Long id, PropertiesDTO propertiesDTO){
       
        Properties idExistente = propertiesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Propriedade não encontrada com id: " + id));
        
        idExistente.setName(propertiesDTO.getName());

        return convertToDTO(propertiesRepository.save(idExistente));
    } 

    //Deletar propriedade
    @Transactional
    public void delete(Long id){

        if (!propertiesRepository.existsById(id)) {
            throw new ResourceNotFoundException("Propriedade não encontrada com o ID: " + id);
        }
        propertiesRepository.deleteById(id);
    }

    // **MÉTODOS AUXILIARES**

    //Converter entidade para DTO
    private PropertiesDTO convertToDTO(Properties properties){
        return new PropertiesDTO(properties.getId(), properties.getName());
    }

}
