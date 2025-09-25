package com.vetsystem.api.repository.pathology;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetsystem.api.model.pathology.Pathology;

@Repository
public interface PathologyRepository extends JpaRepository<Pathology, Long> {
}
