package com.vetsystem.api.repository.phytotherapeutic;

import com.vetsystem.api.model.phytotherapeutic.Phytotherapeutic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhytotherapeuticRepository extends JpaRepository<Phytotherapeutic, Long> {

    /**
     * CORRIGIDO: Agora busca diretamente através da relação 'diseaseTreated'
     * na entidade Phytotherapeutic, e então pelo campo 'name' dentro de DiseaseTreated.
     */
    List<Phytotherapeutic> findByDiseaseTreated_NameIgnoreCase(String diseaseName);
}