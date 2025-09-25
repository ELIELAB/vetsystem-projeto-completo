package com.vetsystem.api.repository.phytotherapeutic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetsystem.api.model.phytotherapeutic.Properties;

@Repository
public interface PropertiesRepository extends JpaRepository<Properties, Long>{
}
