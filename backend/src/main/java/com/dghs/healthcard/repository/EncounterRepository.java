package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.Encounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface EncounterRepository extends JpaRepository<Encounter, UUID> {
    List<Encounter> findByPatientIdOrderByVisitDateDesc(UUID patientId);
}
