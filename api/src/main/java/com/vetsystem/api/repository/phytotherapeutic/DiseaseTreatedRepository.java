package com.vetsystem.api.repository.phytotherapeutic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetsystem.api.model.phytotherapeutic.DiseaseTreated;

@Repository
public interface DiseaseTreatedRepository extends JpaRepository<DiseaseTreated, Long> {
}
