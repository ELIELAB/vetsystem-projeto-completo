package com.vetsystem.api.repository.dayToDayCases;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vetsystem.api.model.dayToDayCases.TreatmentProtocols;

@Repository
public interface TreatmentProtocolsRepository extends JpaRepository<TreatmentProtocols, Long> {   
}
