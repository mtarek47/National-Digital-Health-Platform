package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.MedicationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MedicationRepository extends JpaRepository<MedicationRecord, UUID> {
    List<MedicationRecord> findByEncounterId(UUID encounterId);
    List<MedicationRecord> findByEncounterPatientIdOrderByPrescribedAtDesc(UUID patientId);
}
